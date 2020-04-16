<script>
import Vue from 'vue'
import ImageTag from '~/components/ImageTag'
import Prism from '~/plugins/prism'

export default {
    props: ['html', 'destinationFolder'],
    data () {
        return {
            content: null
        }
    },
    render(h) {
        const render = {
            components: { ImageTag },
            template: "<div>" + this.html + "</div>",
            mounted () {
                if (!this.$el || !this.$el.querySelectorAll) return false

                this.$el.querySelectorAll('pre>code').forEach((e) => {
                    e.parentNode.classList.add('line-numbers')
                })
                Prism.highlightAll()
            }
        }
        return h(render)
    },
    mounted () {
        const baguetteBox = require("baguettebox.js");
        baguetteBox.run('main>div>article', {
            captions: function(element) {
                var span = element.parentNode.getElementsByTagName('span');
                if (span.length === 1) {
                    return span[0].innerText;
                } else {
                    return element.getElementsByTagName('img')[0].alt;
                }
            }
        })
    }
}
</script>

<style>
@import "baguettebox.js/dist/baguetteBox.min.css";
</style>
