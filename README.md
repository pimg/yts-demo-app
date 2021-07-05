# Intro

YTS Test App is an app that is used internally and for demo purposes. Its main purpose is to provide the ability to test
new features against the team or acceptance environments.

### Local development

The app has a backend and frontend that run on different ports. In order to call the backend via the frontend port (
thereby avoiding browser CORS restrictions), start the backend from your IDE or from the command line using
the `java jar` command or via a run configuration in your IDE.

Then start the frontend by running `npm run-script start` from the `angular-app` directory. This will start the Angular
development server on port `4200` and a reverse proxy that maps paths starting with `/api` to the backend
at `localhost:8080"`.

The proxy also maps the path `/.well-known` so that LetEncrypt will be able to access the TLS challenge endpoint.

You can access the application at http://localhost:4200

# Running via NGROK or other tunneling service

YTS needs client application to be accessible via a public domain for two purposes,

- Redirecting the user back to the client after they provided consent at the bank
- Sending webhooks

Webhooks can only be sent over TLS to an endpoint that serves a valid CA-issued server certificate. Take the following
steps to host the app on a public domain and to retrieve a valid certificate for this domain from LetsEncrypt.

1. Find a tunneling service and set it up. I use Ngrok. You should configure the service to map to https://localost:4200. 
   For Ngrok the command `ngrok http 4200` will achieve this.
2. In `application-<environment>.properties` set `app.tls-hostname` to your tunneled domain, for example
   `app.tls-hostname=4d8428fb297e.ngrok.io`. Setting this property will enable TLS on the specified domain.
3. First, start the front-end (see 'Local Development'). You must first start the front-end for the TLS challenge
   endpoint to become available via the Angular development proxy.
4. Then, start the backend and check log output. It should indicate that a certificate was successfully obtained from
   LetsEncrypt:
   ```
   TLS: finalizing order.
   TLS: got certificate, reconfiguring ConfigurableServletWebServerFactory.
   TLS: reconfiguring done, you can now enjoy: https://4d8428fb297e.ngrok.io/
   ```

### Creating a build

To create a packaged build of the production app run `mvn clean install`

### Improvements over to the old YTS Tester app

- Angular 10 front-end instead of Freemarker templates
- Better looking UI and more intuitive navigation
- Includes enrichment, enrichment feedback and UK PIS
- Always runs through a public domain (NGROK for example), so no need to copy-paste redirect URLs anymore
- Built on the separate YTS Java SDK that hides the heavy lifting of interacting with YTS

### LetsEncrypt

To run the full add bank flow this app must be able to accept TLS connections and use a CA issued certificate, because
YTS only sends webhooks to https endpoints with a valid certificate.

In the backend `TlsSetupConfigurer` orders a certificate from LetsEncrypt using the ACME protocol. Before LetsEncrypt
issues the certificate it queries this application through the provided domain as part of its domain challenge.

The path at which LetsEncrypt queries this app can not be configured. It is part of the ACME protocol:
`/.well-known/acme-challenge/{token}`. Since this app runs behind a development proxy this URL cann

### Security considerations

- The app creates a user on the fly and returns the user id as a secure cookie. So the user acts as a session id.

### Before this app can be run in production

- A TLS certificate from a different CA than the auto-configured LetsEncrypt cert should be configured
- The cookie used to store the user id can be set to `secure` on production, that is, send over TLS only.
- Consent provided to YTS must still be saved, see `provide.consent.component.ts`
-

### Discoveries

- Nobody wants to show a 'user-site' in the front-end. It is a necessary evil. We should clearly explain that user-sites
  exist as a representation of the connection and holder of connection status and that they are merely a necessity to
  follow the bank's approach of having a single token for multiple accounts.
- We should explain that YTS allows multiple connections to the same bank for ABN AMRO (what about ASN? They do token
  per account too). We should probably disallow multiple connection per user and site for other banks.
- We should explain that a user-site per account approach will not work for dealing with multiple accounts at the same
  bank. The newer consent might disable to first consent (better yet: we disable multiple connections per site, see
  previous bullet)
- We should explain that clients can and perhaps should limit the number of connections for a bank, per bank
  (many for ABN, 1 for all others) (this is old: just stop allowing multiple connections per bank, except for
  token-per-account banks)
- We should explain that there are no guarantees as to what accounts a user will select as part of their consent. So the
  accounts within a user-site may change over time (Yolt retains existing accounts if they are no longer provided by the
  bank)
- We should explain that managing consents happens at the user-site level: refresh data, update consent.
- Accounts lifecycle : what happens if an account is present, then no longer present after re-consent, and then present
  again -> will this currently result in a gap? Double check.. In general, we should document how the accounts within a
  user-site can change.
- Also explain : what happens if an account is newly added to an existing user-site. Is full data fetched for this
  account or only the last 40 days?
- [IDEA] Clients currently can't know if the flywheel is running for a user-site. If we implement activity history we
  inherently are also exposing currently running activities. This may invite some clients to poll for currently running
  activities, because they may want to see from the start when the flywheel is running, instead of only being informed
  after the fact by a webhook. Alternatively, we could introduce a new 'initiated' webhook. In any case, this is all
  nice to have, but interesting to think about.
- We should add the created timestamp to the user-site and other (accounts, transactions)
- Having the option to connect to the same bank more than once forces clients to deal with deduplication and leads to
  inevitable questions about why YTS isn't doing this on their side. We have seen this with CASY and Jortt already.
- [IDEA] When clients start a refresh of a single or multiple user-sites they currently don't know which user-sites were
  actually included in the activity, that is, which user-sites were found eligible for refresh by Yolt. This makes it
  impossible to know exactly which user-sites to mark as 'currently updating' in the front-end, unless they replicate
  Yolt (eligibility) logic in their system.
- [IDEA] When clients start a refresh they currently don't know when it is finished until they receive a webhook. It is
  impossible to determine when a webhook was missed or whether it is just late. Activity history with a `running`
  parameter that selects running activities will help in this scenario, although it allows clients to poll.
- [FIGURE OUT] For a single user-site refresh, can clients get both DATA_SAVED and ACTIVITY_FINISHED webhooks with an
  error in the last? Can the activity batch cause this scenario?
- [IDEA] We need consent expiration as a field. Is a lot of work, but it is useful. I can't build a decent 'your consent
  is about to expire' feature with YTS
- When a user returns from the bank, there is no way to tell if it was for an AIS or PIS flow unless the client keeps
  information about this. Maybe we should expose AIS and PIS sessions on endpoints. We could even integrate the
  user session to work for AIS and PIS.
