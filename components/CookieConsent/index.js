import { useEffect } from "react";

const contactUs = "info@a-group.cz"

export default function CookieConsent() {
    useEffect(() => {
      if(window !== undefined && typeof window.initCookieConsent === 'function') {
        const cc = window.initCookieConsent();

        cc.run({
          autorun: true,
          current_lang: 'cs',
          theme_css: 'https://cdn.jsdelivr.net/gh/orestbida/cookieconsent@v2.8.0/dist/cookieconsent.css',
          autoclear_cookies: true,
          page_scripts: true,

          gui_options: {
            consent_modal: {
                layout: 'cloud',               // box/cloud/bar
                position: 'bottom center',     // bottom/middle/top + left/right/center
                transition: 'slide',           // zoom/slide
                swap_buttons: false            // enable to invert buttons
            },
            // settings_modal: {
            //     layout: 'box',                 // box/bar
            //     // position: 'left',           // left/right
            //     transition: 'slide'            // zoom/slide
            // }
          },
      
          // mode: 'opt-in'                          // default: 'opt-in'; value: 'opt-in' or 'opt-out'
          // delay: 0,                               // default: 0
          // auto_language: null                     // default: null; could also be 'browser' or 'document'
          // autorun: true,                          // default: true
          // force_consent: false,                   // default: false
          // hide_from_bots: false,                  // default: false
          // remove_cookie_tables: false             // default: false
          // cookie_name: 'cc_cookie',               // default: 'cc_cookie'
          // cookie_expiration: 182,                 // default: 182 (days)
          // cookie_necessary_only_expiration: 182   // default: disabled
          // cookie_domain: location.hostname,       // default: current domain
          // cookie_path: '/',                       // default: root
          // cookie_same_site: 'Lax',                // default: 'Lax'
          // use_rfc_cookie: false,                  // default: false
          // revision: 0,                            // default: 0
      
          onFirstAction: function(user_preferences, cookie){
              // callback triggered only once
          },
      
          onAccept: function (cookie) {
              // ...
          },
      
          onChange: function (cookie, changed_preferences) {
              // ...
          },
      
          languages: {
            'cs': {
                consent_modal: {
                    title: 'Aby web správně fungoval používáme cookies',
                    description: 'Cookies používáme ke zlepšení prohlížení webu a poskytování dalších funkcí. Souhlas udělíte kliknutím na tlačítko "Povolit vše" nebo ho můžete odmítnout <button type="button" data-cc="accept-necessary" class="cc-link">zde</button>.',
                    primary_btn: {
                        text: 'Povolit vše',
                        role: 'accept_all'              // 'accept_selected' or 'accept_all'
                    },
                    secondary_btn: {
                        text: 'Nastavit preference',
                        role: 'settings'        // 'settings' or 'accept_necessary'
                    }
                },
                settings_modal: {
                    title: 'Nastavení cookies',
                    save_settings_btn: 'Souhlasím s vybranými cookies',
                    accept_all_btn: 'Souhlasím se všemi cookies',
                    reject_all_btn: false,
                    close_btn_label: 'Zavřít',
                    blocks: [
                        {
                            description: 'Upravte si cookies dle vlastních preferencí.'
                        }, {
                            title: 'Technické cookies',
                            description: 'Tyto cookies jsou nezbytné pro správné a bezpečné fungování webu. Technické cookies nelze vypnout.',
                            toggle: {
                                value: 'necessary',
                                enabled: true,
                                readonly: true          // cookie categories with readonly=true are all treated as "necessary cookies"
                            }
                        }, {
                            title: 'Analytické cookies',
                            description: 'Analytické cookies umožňují měření výkonu webu. Jejich pomocí určujeme třeba počet a zdroje návštěv. Získaná data jsou samozřejmě anonymní.',
                            toggle: {
                                value: 'analytics',     // your cookie category
                                enabled: false,
                                readonly: false
                            }
                        }, {
                            title: 'Reklamní cookies',
                            description: 'Tyto soubory cookies shromažďují informace o tom, jak webové stránky používáte, které stránky jste navštívili a na které odkazy jste klikli. Souhlas s těmito cookies lze kdykoliv odvolat.',
                            toggle: {
                                value: 'targeting',
                                enabled: false,
                                readonly: false
                            }
                        }, {
                            title: 'Další informace',
                            description: `V případě dalších dotazů ohledně podmínek a nastavení, neváhejte a <a class="cc-link" href="mailto:${contactUs}">kontaktujte nás</a>.`,
                        }
                    ]
                }
            }
          }
      });
      }
      

    }, []);

    return null;
}