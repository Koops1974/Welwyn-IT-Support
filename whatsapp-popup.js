/*
 * Friendly WhatsApp prompt.
 * Appears once per browsing session, 20 seconds after the page loads.
 * Shared by the site's pages; edit the constants below to change behaviour.
 */
(function () {
    var STORAGE_KEY = 'wt_whatsapp_prompt_shown';
    var DELAY_MS = 20000; /* 20 seconds */
    var WHATSAPP_URL = 'https://wa.me/447814009859';

    /* Only show once per session. If session storage is unavailable, continue. */
    try {
        if (sessionStorage.getItem(STORAGE_KEY) === '1') {
            return;
        }
    } catch (e) {
        /* Storage blocked; carry on without persistence. */
    }

    function markShown() {
        try {
            sessionStorage.setItem(STORAGE_KEY, '1');
        } catch (e) {
            /* Ignore storage errors. */
        }
    }

    function show() {
        if (document.getElementById('wt-wa-popup')) {
            return;
        }

        var style = document.createElement('style');
        style.textContent = [
            '#wt-wa-popup{position:fixed;right:20px;bottom:20px;z-index:9999;max-width:320px;background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;box-shadow:0 18px 45px rgba(15,23,42,0.22);padding:18px 44px 18px 20px;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#334155;animation:wtWaIn .3s ease-out;}',
            '#wt-wa-popup p{margin:0 0 14px;font-size:0.98rem;line-height:1.5;}',
            '#wt-wa-popup strong{color:#0f172a;}',
            '#wt-wa-close{position:absolute;top:8px;right:8px;width:30px;height:30px;border:0;border-radius:50%;background:transparent;color:#64748b;font-size:1.4rem;line-height:1;cursor:pointer;}',
            '#wt-wa-close:hover{background:#f1f5f9;color:#0f172a;}',
            '#wt-wa-link{display:inline-flex;align-items:center;gap:8px;background:#25d366;color:#ffffff;text-decoration:none;font-weight:700;padding:11px 18px;border-radius:8px;font-size:0.98rem;}',
            '#wt-wa-link:hover{background:#1da851;}',
            '#wt-wa-link svg{flex:0 0 auto;display:block;}',
            '@keyframes wtWaIn{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}',
            '@media (max-width:520px){#wt-wa-popup{left:16px;right:16px;bottom:16px;max-width:none;}}',
            '@media (prefers-reduced-motion:reduce){#wt-wa-popup{animation:none;}}'
        ].join('\n');
        document.head.appendChild(style);

        var box = document.createElement('div');
        box.id = 'wt-wa-popup';
        box.setAttribute('role', 'dialog');
        box.setAttribute('aria-label', 'WhatsApp chat invitation');
        box.innerHTML =
            '<button id="wt-wa-close" type="button" aria-label="Close WhatsApp prompt">&times;</button>' +
            '<p><strong>Need a hand with your tech?</strong> WhatsApp me for a chat and I\u2019ll help you work out the next step.</p>' +
            '<a id="wt-wa-link" href="' + WHATSAPP_URL + '" target="_blank" rel="noopener">' +
            '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false" fill="currentColor">' +
            '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>' +
            '</svg>' +
            '<span>WhatsApp Me</span></a>';

        document.body.appendChild(box);

        /* Count it as shown for this session, even if not dismissed. */
        markShown();

        function dismiss() {
            if (box.parentNode) {
                box.parentNode.removeChild(box);
            }
            document.removeEventListener('keydown', onKeydown);
        }

        function onKeydown(event) {
            if (event.key === 'Escape') {
                dismiss();
            }
        }

        box.querySelector('#wt-wa-close').addEventListener('click', dismiss);
        box.querySelector('#wt-wa-link').addEventListener('click', markShown);
        document.addEventListener('keydown', onKeydown);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            window.setTimeout(show, DELAY_MS);
        });
    } else {
        window.setTimeout(show, DELAY_MS);
    }
})();
