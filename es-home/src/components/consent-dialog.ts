import Tonic from '@optoolco/tonic';
import './consent-dialog.css';

export class EsConsentDialog extends Tonic {

  connected = async () => {
    this.showApp();
  }

  onclick = (e: any) => {
    e.preventDefault();
    try {
      switch (e.target.id) {
        case 'acceptButton':
          this.acceptHandler();
          break;
        case 'agreementLink':
          this.handleUserAgreementClick();
          break;
        case 'returnToConsentButton':
          this.handleReturnToConsentClick();
          break;
      }
    } catch (err) {
      console.error(err);
    }
  }

  handleUserAgreementClick() {
    this.hideConsent();
    this.showAgreement();
  }

  handleReturnToConsentClick() {
    this.hideAgreement();
    this.showConsent();
  }

  hideConsent() {
    const consent = document.getElementById('consent');
    if (consent) {
      consent.style.display = 'none';
    } else {
      console.error('Could not find consent');
    }
  }

  hideAgreement() {
    const agreement = document.getElementById('agreement');
    if (agreement) {
      agreement.style.display = 'none';
    } else {
      console.error('Could not find agreement');
    }
  }

  showConsent() {
    const consent = document.getElementById('consent');
    if (consent) {
      consent.style.display = 'block';
    } else {
      console.error('Could not find consent');
    }
  }

  showAgreement() {
    const agreement = document.getElementById('agreement');
    if (agreement) {
      agreement.style.display = 'block';
    } else {
      console.error('Could not find agreement');
    }
  }

  hideConsentDialog() {
    const consentDialog = document.getElementById('es-consent-dialog')
    if (consentDialog) {
      consentDialog.style.display = 'none'
    } else {
      console.error('Could not find #es-consent-dialog')
    }
  }

  hideHomePage() {
    const homePage = document.getElementById('es-home-page');
    if (homePage) {
      homePage.style.display = 'none';
    } else {
      console.error('Could not find #es-home-page');
    }
  }

  showConsentDialog() {
    const consentDialog = document.getElementById('es-consent-dialog')
    if (consentDialog) {
      consentDialog.style.display = 'block'
    } else {
      console.error('Could not find #es-consent-dialog')
    }
  }

  showHomePage() {
    const homePage = document.getElementById('es-home-page');
    if (homePage) {
      homePage.style.display = 'block';
    } else {
      console.error('Could not find #es-home-page');
    }
  }

  hasAcceptedConsent() {
    const acceptedConsent = sessionStorage.getItem("acceptedConsent");
    let hasAcceptedConsent = false;
    if (acceptedConsent && acceptedConsent === 'true') {
      hasAcceptedConsent = true;
    }
    return hasAcceptedConsent;
  }

  showApp() {
    if (!location.hash) {
      if (this.hasAcceptedConsent()) {
        this.hideConsentDialog();
        let appPage = new URLSearchParams(window.location.search).get('app');
        if (appPage != null) {
          location.hash = appPage;
        } else {
          this.showHomePage();
        }
      } else {
        this.showConsentDialog();
      }
    } else {
      if (this.hasAcceptedConsent()) {
        this.hideConsentDialog();
      } else {
        this.showConsentDialog();
        return false;
      }
    }
  }

  acceptHandler() {
    sessionStorage.setItem("acceptedConsent", 'true');
    location.reload();
  }

  render() {
    return this.html`  
      <div class='content-container'>
        <div id='consent' class='consent-container'>
          <div>
            <div class='title'>
              <h3>US GOVERNMENT NOTICE AND CONSENT BANNER</h3>
              <hr />
            </div>
            <p>You are accessing a U.S. Government (USG) Information System (IS) that is provided for USG-authorized use only.
              By using this IS (which includes any device attached to this IS), you consent to the following conditions:</p>
            <p>- The USG routinely intercepts and monitors communications on this IS for purposes including, but not limited
              to, penetration testing, COMSEC monitoring, network operations and defense, personnel misconduct (PM), law
              enforcement (LE), and counterintelligence (CI) investigations.</p>
            <p>- At any time, the USG may inspect and seize data stored on this IS.</p>
            <p>- Communications using, or data stored on, this IS are not private, are subject to routine monitoring,
              interception, and search, and may be disclosed or used for any USG authorized purpose.</p>
            <p>- This IS includes security measures (e.g., authentication and access controls) to protect USG interests--not
              for your personal benefit or privacy.</p>
            <p>- Notwithstanding the above, using this IS does not constitute consent to PM, LE or CI investigative searching
              or monitoring of the content of privileged communications, or work product, related to personal representation or
              services by attorneys, psychotherapists, or clergy, and their assistants. Such communications and work product
              are private and confidential. See <a id='agreementLink' class='link'>User Agreement</a> for details.</p>
          </div>
          <div class='button-container'>
            <button id='acceptButton' class='button' alt="I Agree">I Agree</button>
          </div>
        </div>
        <div id='agreement' class='agreement-container'>
          <div class='title'>
            <h3>NOTICE AND CONSENT PROVISION FOR ALL DOD INFORMATION SYSTEM USER AGREEMENTS</h3>
            <hr />
          </div>
          <div>
            <div>
              <p>By signing this document, you acknowledge and consent that when you access Department of Defense (DoD)
                information systems:</p>
              <ul>
                <li>You are accessing a U.S. Government (USG) information system (IS) (which includes any device attached to
                  this information system) that is provided for U.S. Government-authorized use only.</li>
                <li>You consent to the following conditions:</li>
              </ul>
              <p>The U.S. Government routinely intercepts and monitors communications on this information system for purposes
                including, but not limited to, penetration testing, communications security (COMSEC) monitoring, network
                operations and defense, personnel misconduct (PM), law enforcement (LE), and counterintelligence (CI)
                investigations.</p>
              <p>At any time, the U.S. Government may inspect and seize data stored on this information system.</p>
              <p>Communications using, or data stored on, this information system are not private, are subject to routine
                monitoring, interception, and search, and may be disclosed or used for any U.S. Government-authorized purpose.
              </p>
              <p>This information system includes security measures (e.g., authentication and access controls) to protect U.S.
                Government interests--not for your personal benefit or privacy.</p>
              <p>Notwithstanding the above, using an information system does not constitute consent to personnel misconduct,
                law enforcement, or counterintelligence investigative searching or monitoring of the content of privileged
                communications or data (including work product) that are related to personal representation or services by
                attorneys, psychotherapists, or clergy, and their assistants. Under these circumstances, such communications
                and work product are private and confidential, as further explained below:</p>
              <p>Nothing in this User Agreement shall be interpreted to limit the user's consent to, or in any other way
                restrict or affect, any U.S. Government actions for purposes of network administration, operation, protection, or
                defense, or for communications security. This includes all communications and data on an information system, regardless
                of any applicable privilege or confidentiality.</p>
              <p>The user consents to interception/capture and seizure of ALL communications and data for any authorized
                purpose (including personnel misconduct, law enforcement, or counterintelligence investigation). However, consent to
                interception/capture or seizure of communications and data is not consent to the use of privileged
                communications or data for personnel misconduct, law enforcement, or counterintelligence investigation against any party and
                does not negate any applicable privilege or confidentiality that otherwise applies.</p>
              <p>Whether any particular communication or data qualifies for the protection of a privilege, or is covered by a
                duty of confidentiality, is determined in accordance with established legal standards and DoD policy. Users are
                strongly encouraged to seek personal legal counsel on such matters prior to using an information system if the
                user intends to rely on the protections of a privilege or confidentiality.</p>
              <p>Users should take reasonable steps to identify such communications or data that the user asserts are
                protected by any such privilege or confidentiality. However, the user's identification or assertion of a privilege or
                confidentiality is not sufficient to create such protection where none exists under established legal
                standards and DoD policy.</p>
              <p>A user's failure to take reasonable steps to identify such communications or data as privileged or
                confidential does not waive the privilege or confidentiality if such protections otherwise exist under established legal
                standards and DoD policy. However, in such cases the U.S. Government is authorized to take reasonable actions
                to identify such communication or data as being subject to a privilege or confidentiality, and such actions do
                not negate any applicable privilege or confidentiality.</p>
              <p>These conditions preserve the confidentiality of the communication or data, and the legal protections
                regarding the use and disclosure of privileged information, and thus such communications and data are private and
                confidential. Further, the U.S. Government shall take all reasonable measures to protect the content of
                captured/seized privileged communications and data to ensure they are appropriately protected.</p>
              <p>In cases when the user has consented to content searching or monitoring of communications or data for
                personnel misconduct, law enforcement, or counterintelligence investigative searching, (i.e., for all communications and
                data other than privileged communications or data that are related to personal representation or services by
                attorneys, psychotherapists, or clergy, and their assistants), the U.S. Government may, solely at its
                discretion and in accordance with DoD policy, elect to apply a privilege or other restriction on the U.S. Government's
                otherwise-authorized use or disclosure of such information.</p>
              <p>All of the above conditions apply regardless of whether the access or use of an information system includes
                the display of a Notice and Consent Banner ("banner"). When a banner is used, the banner functions to remind the
                user of the conditions that are set forth in this User Agreement, regardless of whether the banner describes these
                conditions in full detail or provides a summary of such conditions, and regardless of whether the banner
                expressly references this User Agreement.</p>
            </div>
            <div class='button-container'>
              <button id='returnToConsentButton' class='button' alt="Return to Consent">Return to Consent</button>
            </div>
          </div>
        </div>
      </div>  
    </div>`
  }
}
