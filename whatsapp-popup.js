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
            '#wt-wa-link{display:inline-flex;align-items:center;gap:8px;background:#2563eb;color:#ffffff;text-decoration:none;font-weight:700;padding:11px 18px;border-radius:8px;font-size:0.98rem;}',
            '#wt-wa-link:hover{background:#1d4ed8;}',
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
            '<a id="wt-wa-link" href="' + WHATSAPP_URL + '" target="_blank" rel="noopener">\uD83D\uDCAC WhatsApp Me</a>';

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
