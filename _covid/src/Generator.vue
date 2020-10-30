<template>
    <ul>
        <li>
            <label>
                <input type="checkbox" v-model="preset" />
                Crée à H - 10 minutes.
            </label>
        </li>
        <li><button @click="go('travail')">Activitée professionnelle</button></li>
        <li><button @click="go('achats')">Achats / Courses</button></li>
        <li><button @click="go('sport_animaux')">Sortie / Promenade</button></li>
        <li><button @click="go('famille')">Familial / Assistance</button></li>
        <li><button @click="go('sante')">Consultations, examens, soins</button></li>
        <li><button @click="go('convocation')">Convocation</button></li>
        <li><button @click="go('missions')">Missions d'intérêt général</button></li>
        <li><button @click="go('enfants')">Sorties pour enfants</button></li>
    </ul>
</template>

<script>
import QRCode from 'qrcode'
import { PDFDocument, StandardFonts } from 'pdf-lib'
import originalPDF from '@/assets/certificate.pdf'

const ys = {
    travail: 578,
    achats: 533,
    sante: 477,
    famille: 435,
    handicap: 396,
    sport_animaux: 358,
    convocation: 295,
    missions: 255,
    enfants: 211
}

export default {
    data () {
        return {
            profiles: {
                cyril: {
                    firstname: 'Cyril',
                    lastname: 'Nicodeme',
                    birthday: '09/06/1985',
                    placeofbirth: 'Belfort',
                    address: '30 rue de la claichiere',
                    city: 'BAVILLIERS',
                    zipcode: '90800'
                },
                aurelie: {
                    firstname: 'Aurelie',
                    lastname: 'Nicodeme',
                    birthday: '22/03/1984',
                    placeofbirth: 'Belfort',
                    address: '30 rue de la claichiere',
                    city: 'BAVILLIERS',
                    zipcode: '90800'
                }
            },
            preset: true
        }
    },
    methods: {
        go (reason) {
            this.generatePDF(this.profiles[this.$route.params.name], reason).then(response => {
                /*
                const link = document.createElement('a')
                const url = URL.createObjectURL(response)
                link.href = url
                link.download = 'attestion.pdf'
                document.body.appendChild(link)
                link.click()
                */
                const url = URL.createObjectURL(response)
                window.open(url)
            })
        },
        async generateQR (text) {
            const opts = {
                errorCorrectionLevel: 'M',
                type: 'image/png',
                quality: 0.92,
                margin: 1
            }
            return QRCode.toDataURL(text, opts)
        },
        async generatePDF (profile, reason) {
            /*
            Reasons:
             * travail
             * achats
             * sante
             * famille
             * sport_animaux
             * convocation
             * missions
             * enfants
             */

            const creationInstant = new Date()
            if (this.preset) {
                creationInstant.setMinutes(creationInstant.getMinutes() - 10)
            }

            const datesortie = creationInstant.toLocaleDateString('fr-FR')
            const heuresortie = creationInstant.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
            const heureSortieH = heuresortie.replace(':', 'h')

            const data = [
                `Cree le: ${datesortie} a ${heureSortieH}`,
                `Nom: ${profile.lastname}`,
                `Prenom: ${profile.firstname}`,
                `Naissance: ${profile.birthday} a ${profile.placeofbirth}`,
                `Adresse: ${profile.address} ${profile.zipcode} ${profile.city}`,
                `Sortie: ${datesortie} a ${heuresortie}`,
                `Motifs: ${reason}`
            ].join(';\n ')

            const existingPdfBytes = await fetch(originalPDF).then((res) => res.arrayBuffer())
            const pdfDoc = await PDFDocument.load(existingPdfBytes)

            // set pdf metadata
            pdfDoc.setTitle('COVID-19 - Déclaration de déplacement')
            pdfDoc.setSubject('Attestation de déplacement dérogatoire')
            pdfDoc.setKeywords([
                'covid19',
                'covid-19',
                'attestation',
                'déclaration',
                'déplacement',
                'officielle',
                'gouvernement'
            ])
            pdfDoc.setProducer('DNUM/SDIT')
            pdfDoc.setCreator('')
            pdfDoc.setAuthor("Ministère de l'intérieur")

            const page1 = pdfDoc.getPages()[0]

            const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
            const drawText = (text, x, y, size = 11) => {
                page1.drawText(text, { x, y, size, font })
            }

            drawText(`${profile.firstname} ${profile.lastname}`, 119, 696)
            drawText(profile.birthday, 119, 674)
            drawText(profile.placeofbirth, 297, 674)
            drawText(`${profile.address} ${profile.zipcode} ${profile.city}`, 133, 652)

            drawText('x', 84, ys[reason], 18)

            const locationSize = this.getIdealFontSize(font, profile.city, 83, 7, 11)
            drawText(profile.city, 105, 177, locationSize)
            drawText(datesortie, 91, 153, 11)
            drawText(heuresortie, 264, 153, 11)

            const generatedQR = await this.generateQR(data)
            const qrImage = await pdfDoc.embedPng(generatedQR)

            page1.drawImage(qrImage, {
                x: page1.getWidth() - 156,
                y: 100,
                width: 92,
                height: 92
            })

            pdfDoc.addPage()
            const page2 = pdfDoc.getPages()[1]
            page2.drawImage(qrImage, {
                x: 50,
                y: page2.getHeight() - 350,
                width: 300,
                height: 300
            })

            const pdfBytes = await pdfDoc.save()

            return new Blob([pdfBytes], { type: 'application/pdf' })
        },
        getIdealFontSize (font, text, maxWidth, minSize, defaultSize) {
            let currentSize = defaultSize
            let textWidth = font.widthOfTextAtSize(text, defaultSize)

            while (textWidth > maxWidth && currentSize > minSize) {
                textWidth = font.widthOfTextAtSize(text, --currentSize)
            }

            return textWidth > maxWidth ? null : currentSize
        }
    }
}
</script>
