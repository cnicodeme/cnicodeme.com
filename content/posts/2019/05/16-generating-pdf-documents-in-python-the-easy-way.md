---
title: Generating PDF documents in Python — The easy way
date: 2019-05-16 17:45:11
description: Generating a PDF document can be hell. Here, we’ll try to make that simpler by using PDFShift.io powerful API.
---

_Generating a PDF document can be hell. Here, we’ll try to make that simpler by using [PDFShift.io](https://pdfshift.io) powerful API. (Plot twist: I’m the founder 😲)_

**_What if I told you it was easy as sending a POST request? Take a look:_**

```python
response = requests.post(
    'https://api.pdfshift.io/v2/convert/',
    auth=(api_key, ''),
    json={'source': raw_html}
)

with open('document.pdf', 'wb') as f:
    f.write(response.content)
```

See? Now, let me say the same thing, but longer:

As a developer, you might find yourself facing the needs to generate a PDF for your application. It could be an invoice to be sent by email, a report to share to your users, or a blog post to be shared to your user’s user.

One simple, efficient and quick way to do that is to first create your document in HTML format. You already master the HTML/CSS elements and can move them like a Jedi, so why not?

All you have to do is convert the HTML into PDF and voilà! Your work is done.

<image-tag src="https://cdn-images-1.medium.com/max/400/0*bS9aiGeh_rbMZh9c.gif" />

Once you have your HTML document ready, one way you can do to get your PDF is by using an API.

[PDFShift](https://pdfshift.io) provides just that, and getting a PDF is as easy as:

```bash
POST https://api.pdfshift.io/v2/convert/ -d source={url}
```

The first thing you will need is an API key to generate the documents without watermark. [Create your account on PDFShift.](https://pdfshift.io/register/) You will get your API key by email right after hitting submit and the free account will let you convert 50 documents per month.

👉 [_Create your account on PDFShift here._](https://pdfshift.io/register/)

We’ll then use the requests library to do the work. It allows you to make network request really easy and simplify all the tedious part of it.

Will start simple, converting your local HTML document to a PDF with no special stuff involved:

```python
import requests

raw_html = None

with open('./document.html', 'r') as f:
    raw_html = f.read()

api_key = 'your_pdfshift_api_key'

response = requests.post(
    'https://api.pdfshift.io/v2/convert/',
    auth=(api_key, ''),
    json={'source': raw_html}
)

# We now ensure that the conversion was successful
try:
    response.raise_for_status()
except:
    # Here, we handle any error that might have occured
    pass

with open('result.pdf', 'wb') as fout:
    fout.write(response.content)

print('Done')
exit(1)
```

A few lines of code later, your application is now generating PDF documents.

<image-tag src="https://cdn-images-1.medium.com/max/260/0*RldSVVzw6O-oC4wq.gif" alt="This is nice!" />

I could stop here, but I’m not sure you realized how lucky you are. So let me share my point of view.

## Why is this better than using {wkhtmltopdf/docker/some_library}?

Good question! One easy answer:

**_headaches_**!

Installing a local software, running your own Docker instance or using a PDF library made for your programming language are all possibilities to generate PDF, but with all of these come a great bargain: maintenance.

You will have to update the software and library, making sure the processes haven’t stopped, or that your Docker server has shut down for an unexpected reason.

Moreover, you might not be able to do some advanced things like the one we’ll cover next.

## Ensuring all your charts are correctly loaded

Now, you are just getting started and you want to generate a PDF of your report to send to all your customers on a monthly basis.

The issue is that the PDF returned is made _before_ the charts have all been loaded, making your PDF useless. PDFShift provides a parameter that let you wait on your document to be finished before continuing the conversion.

This is useful here because you can wait for all your charts to be rendered before generating the PDF, ensuring that the document you’ll get back are _perfect_. This parameter is wait_for and the value is just the name of a javascript function that will be globally present (think window).

Here’s the initial code, with the wait_for parameter:

```python
import requests

raw_html = None

with open('./document.html', 'r') as f:
    raw_html = f.read()

api_key = 'your_pdfshift_api_key'

response = requests.post(
    'https://api.pdfshift.io/v2/convert/',
    auth=(api_key, ''),
    json={
        'source': raw_html,
        'wait_for': 'pdfshiftReady' # That's just the line we added ...
    }
)

# We now ensure that the conversion was successful
try:
    response.raise_for_status()
except:
    # Here, we handle any error that might have occured
    pass

with open('result.pdf', 'wb') as fout:
    fout.write(response.content)

print('Done')
exit(1)
```

## Processing multiple documents at once

Now imagine you have tons of documents to generate, one per user. Sending a POST request for each of them will take time and waiting for the result back might takes days of running process, hoping nothing will break in the middle!

On the other hand, what you can do is send the conversion in batch, up to 50 per request, and don’t have to wait for the result to come back.

Imagine you load your entire user&#39;s database and want to generate a custom report for each of them. This script will do exactly that and will be processed in a few minutes.

All you’ll need is a publicly available endpoint that will receive a POST request from us (we love POST) containing an URL to your generated PDF content!

We’ve taken this case and made a code just for you to see:

```python
import requests
from database import db  # This is just for the example here

api_key = 'your_pdfshift_api_key'

# We could improve this part too
users = db.execute('SELECT id FROM users WHERE removed IS NULL').all()

# Splitting users in chunks of 50:
chunks = [users[i:i + 50] for i in range(0, len(users), 50)]

for c in chunks:
    # Creating custom URL for each of our users
    urls = ['https://your-website.com/report/user?id={0}'.format(x['id']) for x in c]

    response = requests.post(
        'https://api.pdfshift.io/v2/convert/',
        auth=(api_key, ''),
        json={
            'source': urls,
            'webhook': 'https://your-website.com/report/webhooks/pdfshift'
        }
    )

    # We now ensure that the conversion was successful
    try:
        response.raise_for_status()
    except:
        # Here, we handle any error that might have occured
        pass

print('Done')
exit(1)
```

## Another real case study, sending an invoice by email

When I first started PDFShift, it was because of a recurring issue I had. I wanted my customers to receive a real, nicely designed PDF invoice of their purchase.

The issue was that I was using a library at the time that required tons of dependencies that had to be installed as a system package directly. Without them, the library wouldn’t work (and even with some of them, it would still fail). Setting all up was costing me a few hours every time and I was getting bored.

So I like to use this example as a real case study because … well … it’s a real case study :)

As you’ll see, the code is a bit long, but converting HTML to PDF only takes a few lines of code, the rest is just email stuff (but interesting, still!):

```python
import requests
import email, smtplib, ssl

from email import encoders
from email.mime.base import MIMEBase
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

pdfshift_api_key = 'your_pdfshift_api_key'

raw_html = None
with open('./templates/invoice.html', 'r') as f:
    raw_html = f.read()

response = requests.post(
    'https://api.pdfshift.io/v2/convert/',
    auth=(pdfshift_api_key, ''),
    json={
        'source': raw_html,
    }
)

# We now ensure that the conversion was successful
try:
    response.raise_for_status()
except:
    # Here, we handle any error that might have occured
    pass


# Create a multipart message and set headers
message = MIMEMultipart()
message["From"] = 'support@your-service.com'
message["To"] = 'customer@gmail.com'
message["Subject"] = 'Thank you for your purchase! Here\'s your invoice!'

# Add body to email
with open('./emails/invoice.txt', 'r') as f:
    message.attach(MIMEText(f.read(), "plain"))

part = MIMEBase("application", "octet-stream")
part.set_payload(response.content)  # Here! We attach PDFShift binary response!

encoders.encode_base64(part)

part.add_header(
    "Content-Disposition",
    "attachment; filename= invoice.pdf",
)

message.attach(part)
complete_email = message.as_string()

# Log in to server using secure context and send email
context = ssl.create_default_context()
with smtplib.SMTP_SSL("smtp.mail-provider.com", 465, context=context) as server:
    server.login('your_email', 'your_password')
    server.sendmail('support@your-service.com', 'customer@gmail.com', complete_email)

exit(1)

```

## Conclusion

Creating a PDF document can be tedious when we don’t have the right tool at our disposal. On the other hand, most of us have been writing HTML/CSS documents for years now and can quickly build a page this way.

[PDFShift](https://pdfshift.io) lets you convert these HTML documents in PDF in just a simple POST request and works everywhere. With it, you don’t have to worry anymore about maintenance, updates, and compatibility issues.

_At [PDFShift](https://pdfshift.io), our motto is the same as the Unix philosophy: We do one thing, and we do it well._

<image-tag src="https://cdn-images-1.medium.com/max/500/0*lyURBsvKhcIfMGwz.gif" />