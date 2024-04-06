// mt

(function(w,d,t,u,n,a,m){w['MauticTrackingObject']=n;
w[n]=w[n]||function(){(w[n].q=w[n].q||[]).push(arguments)},a=d.createElement(t),
m=d.getElementsByTagName(t)[0];a.async=1;a.src=u;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://mautic.agilicus.com/myc.js','mt');

var agilicus_name = undefined;
var agilicus_email = undefined;
function agilicus_do_bsid() {
    var urlParams = new URLSearchParams(window.location.search);
    var mt_event = {};
    var utm_source = urlParams.get('utm_source') || undefined;
    if (utm_source) { mt_event.utm_source = utm_source; }
    var utm_campaign = urlParams.get('utm_campaign') || undefined;
    if (utm_campaign) { mt_event.utm_source = utm_campaign; }
    const utm_term = urlParams.get('utm_term') || undefined;
    if (utm_term) { mt_event.utm_source = utm_term; }
    var email = urlParams.get('email') || undefined;
    var bsid = urlParams.get('bsid') || undefined;
    if (typeof(bsid) === 'undefined') {
        urlParams = new URLSearchParams(window.referer);
        bsid = urlParams.get('bsid') || undefined;
    }
    mt_event.page_title = document.title;
    if (bsid) {
        const bsid_decoded = atob(bsid);
        const bsid_j = JSON.parse(bsid_decoded);
        email = bsid_j['email'];
        var u_name = bsid_j['name'];
        if (u_name) {
            const ns = u_name.split(" ");
            if (ns.length == 2) {
                    mt_event.firstname = ns[0];
                    mt_event.lastname = ns[1];
            }
            mt_event.name = u_name;
        }
        var u_slug = bsid_j['slug'];
        if (u_slug) {
            mt_event.tags = `webinar-attended,${u_slug}`;
        }
        var u_utm_campaign = bsid_j['campaign'];
        if (u_utm_campaign) {
            mt_event['utm_campaign'] = u_utm_campaign;
        } else {
            mt_event['utm_campaign'] = u_slug;
        }
        var u_utm_source = bsid_j['source'];
        if (u_utm_source) {
            mt_event['utm_source'] = u_utm_source;
        }
    }
    if (email) { mt_event.email = email; }
    agilicus_email = mt_event['email'];
    agilicus_name = mt_event['name'];
mt_event.page_url = "https://www.agilicus.com/WebinarAttend";
mt('send', 'pageview', mt_event);
}

function setNativeValue(element, value) {
  const valueSetter = Object.getOwnPropertyDescriptor(element, 'value').set;
  const prototype = Object.getPrototypeOf(element);
  const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;

  if (valueSetter && valueSetter !== prototypeValueSetter) {
    prototypeValueSetter.call(element, value);
  } else {
    valueSetter.call(element, value);
  }
}

function _doAutoSignin() {
    //consentCheck
    const cb = document.getElementById('consentCheck');
    if (cb) {
        cb.checked = true;
        cb.dispatchEvent(
          new Event("input", { bubbles: true, cancelable: true })
        );
        const cf = document.getElementsByClassName('form-check');    
        if (cf && cf.length >0) {
            // cf[0].style.display = 'none';
        }
    }
    if (agilicus_name) {
        const cn = document.getElementById('joinFormName');
        if (cn) {
            // react owns the fields, so must trigger internal state change detect
            cn.value = agilicus_name;
            cn._valueTracker?.setValue("");
            cn.dispatchEvent(
              new Event("input", { bubbles: true, cancelable: true, simulated: true })
            );
            cn.dispatchEvent(
              new Event("change", { bubbles: true, cancelable: true })
            );
        }
        for (const button of document.getElementsByTagName('button')) {
            if (button.innerText == ' View Recordings') {
                button.style.display = 'none';
            }
            if (button.innerText == 'Join Meeting') {
                /*
                var ev = new Event('click', { bubbles: true, cancelable: true});
                button.dispatchEvent(ev);
                */
                button.click();
            }
        }
    }
}

function watch_title_changes() {
  if ('Navigation' in window) {
      navigation.addEventListener('navigate', () => {
          mt('send', 'pageview');
      });
  }
}

window.setTimeout( () => { 
    agilicus_do_bsid();
    watch_title_changes();
    _doAutoSignin();
}, 800);
