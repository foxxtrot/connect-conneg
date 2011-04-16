connect-conneg
--------------

A module meant to be plugged into the NodeJS connect middleware, which
processes the Accept, Accept-Languages, and Accept-Charset HTTP headers to
enable you to prioritize the type of data returned down the wire for an HTTP
request.

This will modify the Request object, adding a list of strings which are sorted
based on the qvalue sent in the HTTP header. These will be mapped to the request
object as follows:

* request.languages - Locale codes from the Accept-Languages header
* request.charsets - Charset identifiers from the Accept-Charset header
* request.accepatableTypes - The MIME types the client is willing to accept

These are sorted per the rules in RFC 2616, Section 14.

Expected Values
---------------

Consider the following HTTP header from my browser:

    Accept-Languages: en-US; q=0.8, en; q=0.5, es

This header indicates the user wants to recieve US English, any English,
or any Spanish. Since a q-value is not assigned to Spanish, it will be assigned
the q-value 1, per the HTTP/1.1 spec. When sorted on q-value we get the following
result in request.languages

    ['es', 'en-US', 'en']

When preparing to render the response to the client, you can reference this list,
shifting results off the front of the list until you encounter a language code
you can honor, and returning content customized to your users language of choice.
If they do not request a language you can honor, then you can choose to return a
default language or an error.

Future versions of this library will include helper methods to perform the lookups
against these arrays.
