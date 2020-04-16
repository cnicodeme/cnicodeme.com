---
title: The story behind ImprovMX
date: 2019-05-15 10:40:55
description: We recently bought ImprovMX. I share here the decision behind it and our plans on how to grow the service.
thumbnail: improvmx.png
---

<image-tag src="https://cdn-images-1.medium.com/max/864/1*0pryEdvAGDBeHzbpiCKnTQ@2x.png" filename="improvmx.png" />

I always had a passion to work with emails. SMTP, POP, and IMAP are filling my stomach with butterflies (something must be off in my brain) and after having sold [VoilaNorbert](https://voilanorbert.com), I was still eager to build Python code that connects to SMTP servers through sockets…

I’ve been using and I knew about [ImprovMX](https://improvmx.com) for many years and it was, for me, one of the tools that were always present. The issue was that the support was non- existent and if you had the misfortune of having a typo in your email, you could say goodbye to using [ImprovMX](https://improvmx.com) (true story).

For this reason, I searched the owner of [ImprovMX](https://improvmx.com) and offered to acquire it in the objective to improve and grow the service. Turns out he was open to discussion and we quickly found common ground. Thank you, Alex! :)

I was excited to acquire [ImprovMX](https://improvmx.com), provide great customer support and improve, iterate and make [ImprovMX](https://improvmx.com) a best in class for email forwarding.

Once the transition was complete, I initially started changing completely how the emails were handled. It was initially using Postfix, but we decided to scratch this and build a customized suite in Python that allows us to do almost everything we wanted, including being able to know how many emails are in forwarding chain (how many we received, how many got accepted and how many got delivered).

We had to implement many systems to avoid spam abuse, greylisting and blacklisting, and we are getting better and better over time.

After that, we worked with Antoine on making a new website to show our commitment to providing a great service. We focus on what we do best: Making a simple, yet powerful service for everyone to use. You can get started quickly and forwarding emails just takes a few steps and can now be done in a few minutes.

Email, in general, is not a piece of cake. Along with all the intricacies of having to manage SPF, SRS, DKIM, DMARC, you also have to fight against spammers, getting blacklisted from time to time because some spams manage to get through your service, and tons of other vicious things that make email …. _so awesome_!

What excites me the most with [ImprovMX](https://improvmx.com) is the reach. We are just getting started here and forwarding is just the beginning. We have so many projects in mind related to email that we need to define a clear roadmap for the future and be sure to play our cards well.

The way we structured our servers and how we wrote the code will allow us to extend and be able to, in the near future, provide many great features to help our customers, help developers and provide more than just email forwarding.

We are just getting started, and we are eager!

<image-tag src="https://cdn-images-1.medium.com/max/80/1*VthvMa_kTX7IkwpAgeOCUQ@2x.png" />