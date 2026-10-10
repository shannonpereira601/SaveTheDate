"""Rebuild the reception-only, one-page PDF from wedding.html.

Double-click pdf-invite/build-reception-pdf.bat
or, from the project folder:
    python pdf-invite/build_reception_pdf.py
"""

from __future__ import annotations

import re
import subprocess
from pathlib import Path

SITE = Path(__file__).resolve().parent.parent
HERE = Path(__file__).resolve().parent
HTML_OUT = HERE / "reception-website.html"
PDF_TMP = HERE / "reception-full.pdf"
PDFS = {
    "gloria": HERE / "Gloria-and-Shannon-Wedding-Invite.pdf",
    "shannon": HERE / "Shannon-and-Gloria-Wedding-Invite.pdf",
}
INVITE_HTML = HERE / "Wedding_Invitation_Shannon_Gloria.html"
RSVP_URL = "https://shannonpereira601.github.io/SaveTheDate/rsvp.html?invite=reception"

CHROME_CANDIDATES = [
    Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe"),
    Path(r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"),
    Path(r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"),
]

PRINT_CSS = """
    @page { size: 390px 28000px; margin: 0; }
    html, body { width: 390px !important; margin: 0 !important; background: #F4F2EB; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    .site-gate, #w-nav, #w-mobile-menu, .hero-scroll, #countdown,
    .hero-aside, .photobooth, #memory-lane, #figures, #faq, .letter-read {
      display: none !important;
    }
    .pdf-rsvp { margin: 4px 0 22px; }
    .pdf-rsvp .countdown-cta { margin-top: 0; }
    .s-hero {
      aspect-ratio: 1500 / 2102 !important;
      height: auto !important;
      min-height: 0 !important;
      padding: 0 !important;
      display: grid !important;
      align-items: center !important;
    }
    .photobooth-shot img,
    html.is-unlocked .photobooth-shot img {
      animation: none !important;
      transform: none !important;
    }
    .fu { opacity: 1 !important; transform: none !important; }
    .hero-grid, .welcome-grid, .figures-grid, .faq-full-grid, .venue-photos {
      grid-template-columns: 1fr !important;
    }
    .hero-aside { justify-self: center !important; max-width: 200px !important; }
    .s-hero .hero-grid {
      grid-template-columns: minmax(0, 1fr) 148px !important;
      align-items: center !important;
    }
    .hero-silhouette { margin: 0; }
    .hero-silhouette img {
      display: block;
      width: 148px;
      height: auto;
    }
    .welcome-art { display: none !important; }
    .hero-display { font-size: 3.1rem !important; letter-spacing: 0.035em !important; }
    .hero-names-script { font-size: 2.15rem !important; white-space: normal !important; }
    .hero-meta { flex-wrap: wrap !important; letter-spacing: 0.18em !important; font-size: 0.85rem !important; }
    .welcome-art { order: -1; justify-self: center; max-width: 280px; }
    .figures-panel:nth-child(odd) { border-right: none !important; }
    .figures-panel:nth-child(-n+3) { border-bottom: 1px solid rgba(201,169,110,0.35) !important; }
    .pie-layout { grid-template-columns: 1fr !important; justify-items: center; }
    .pie-disk { justify-self: center !important; }
    .itinerary-layout { flex-direction: column !important; }
    .itinerary-rotated-title {
      writing-mode: horizontal-tb !important;
      transform: none !important;
      text-align: center;
      font-size: 2.4rem !important;
    }
    .faq-full-grid { grid-template-columns: 1fr !important; }
    .venue-map-embed { aspect-ratio: 4 / 3; }
    .venue-map-embed img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      filter: grayscale(30%) sepia(20%);
    }
    .timeline { max-width: 100% !important; }
    .timeline::before { left: 3.25rem !important; transform: none !important; }
    .timeline-item {
      grid-template-columns: 6.5rem minmax(0, 1fr) !important;
      grid-template-rows: auto auto !important;
      margin-bottom: 20px !important;
    }
    .timeline-item:nth-child(odd) .timeline-year-wrap,
    .timeline-item:nth-child(even) .timeline-year-wrap {
      grid-column: 1 !important;
      grid-row: 1 !important;
    }
    .timeline-item:nth-child(odd) .timeline-polaroid,
    .timeline-item:nth-child(even) .timeline-polaroid {
      grid-column: 2 !important;
      grid-row: 1 !important;
      justify-self: start !important;
      transform: rotate(-1deg) !important;
      margin-left: 6px !important;
      margin-right: 0 !important;
      max-width: 150px !important;
    }
    .timeline-item:nth-child(odd) .timeline-caption,
    .timeline-item:nth-child(even) .timeline-caption {
      grid-column: 2 !important;
      grid-row: 2 !important;
      justify-self: stretch !important;
      align-self: start !important;
      width: auto !important;
      max-width: none !important;
      text-align: left !important;
      padding: 0 2px !important;
    }
    .timeline-item:nth-child(odd) .timeline-year-wrap::before,
    .timeline-item:nth-child(even) .timeline-year-wrap::before {
      left: 50% !important;
      right: -6px !important;
    }
"""

HEAD_SCRIPT = """  <script>
    document.documentElement.classList.add("js", "is-unlocked", "is-print", "tier-reception");
  </script>
  <style>
""" + PRINT_CSS + """
  </style>"""

OLD_HEAD = """  <script>
    document.documentElement.classList.add("js");
    if (window.matchMedia && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.documentElement.classList.add("js-motion");
    }
    try {
      if (sessionStorage.getItem("gs-rules") !== "2") {
        sessionStorage.removeItem("gs-tier");
        sessionStorage.removeItem("gs-lead");
      }
      var _tier = sessionStorage.getItem("gs-tier");
      var _lead = sessionStorage.getItem("gs-lead");
      if (_tier === "full" || _tier === "reception") {
        document.documentElement.classList.add("is-unlocked", "tier-" + _tier);
      } else {
        document.documentElement.classList.add("is-gated");
      }
      if (_lead === "gloria" || _lead === "shannon") {
        document.documentElement.classList.add("lead-" + _lead);
      }
      if (_lead === "shannon") {
        document.title = document.title.replace("Gloria & Shannon", "Shannon & Gloria");
      }
    } catch (e) {
      document.documentElement.classList.add("is-gated");
    }
  </script>"""

POLYFILL = """<script>
(function () {
  var orig = window.matchMedia;
  window.matchMedia = function (q) {
    if (String(q).indexOf("prefers-reduced-motion") !== -1) {
      return {
        matches: true,
        media: String(q),
        addEventListener: function () {},
        removeEventListener: function () {},
        addListener: function () {},
        removeListener: function () {}
      };
    }
    return orig.apply(window, arguments);
  };
})();
</script>
"""


def prepare_silhouette() -> None:
    from PIL import Image

    image = Image.open(SITE / "assets" / "img" / "silhouette.png").convert("RGBA")
    image.putdata([
        (r, g, b, 0) if r < 28 and g < 28 and b < 28 else (r, g, b, a)
        for r, g, b, a in image.get_flattened_data()
    ])
    image.save(HERE / "silhouette.png")


def find_browser() -> Path:
    for path in CHROME_CANDIDATES:
        if path.exists():
            return path
    raise SystemExit("Chrome or Edge was not found. Install Chrome, then run this again.")


def span_inner(html: str, class_name: str) -> str | None:
    needle = f'class="{class_name}"'
    start = html.find(needle)
    if start < 0:
        return None
    open_end = html.find(">", start)
    if open_end < 0:
        return None
    i = open_end + 1
    depth = 1
    while i < len(html) and depth:
        next_open = html.find("<span", i)
        next_close = html.find("</span>", i)
        if next_close < 0:
            return None
        if next_open != -1 and next_open < next_close:
            depth += 1
            i = next_open + 5
        else:
            depth -= 1
            if depth == 0:
                return html[open_end + 1 : next_close]
            i = next_close + len("</span>")
    return None


def flatten_name_swaps(html: str, lead: str) -> str:
    """Keep one couple-name order. Hidden alternates are removed, not just hidden."""
    preferred = "names-gloria" if lead == "gloria" else "names-shannon"
    pieces: list[str] = []
    cursor = 0
    while True:
        mark = html.find("names-swap", cursor)
        if mark < 0:
            pieces.append(html[cursor:])
            break
        open_tag = html.rfind("<", 0, mark)
        tag_match = re.match(r"<(\w+)", html[open_tag:])
        if tag_match is None:
            raise SystemExit("Could not read a names-swap tag.")
        tag = tag_match.group(1)
        content_start = html.find(">", mark) + 1
        depth = 1
        i = content_start
        close = f"</{tag}>"
        while i < len(html) and depth:
            next_open = html.find(f"<{tag}", i)
            next_close = html.find(close, i)
            if next_close < 0:
                raise SystemExit("Could not close a names-swap tag.")
            if next_open != -1 and next_open < next_close:
                depth += 1
                i = next_open + len(tag) + 1
            else:
                depth -= 1
                i = next_close + len(close)
        block = html[content_start : i - len(close)]
        chosen = span_inner(block, preferred) or span_inner(block, "names-default")
        if chosen is None:
            raise SystemExit("A names-swap block has no name to keep.")
        opening = html[open_tag:content_start].replace(" names-swap", "")
        pieces.append(html[cursor:open_tag])
        pieces.append(opening + chosen + close)
        cursor = i
    return "".join(pieces)


def build_html(lead: str) -> None:
    src = (SITE / "wedding.html").read_text(encoding="utf-8")
    src = src.replace('src="./', 'src="../').replace('href="./', 'href="../')
    if OLD_HEAD not in src:
        raise SystemExit("wedding.html head script changed. Update pdf-invite/build_reception_pdf.py.")
    src = src.replace(OLD_HEAD, HEAD_SCRIPT, 1)
    src = re.sub(r'<script src="../js/gate.js[^"]*"></script>\s*', "", src, count=1)
    src = src.replace(' loading="lazy"', "")

    start = src.find('<div class="site-gate"')
    hero = src.find('<section id="hero"')
    if start < 0 or hero < 0:
        raise SystemExit("Could not find the password gate or hero in wedding.html.")
    src = src[:start] + src[hero:]
    src = strip_print_only_content(src)
    src = flatten_name_swaps(src, lead)

    needle = '<script src="../js/wedding.js'
    if needle not in src:
        raise SystemExit("Could not find wedding.js in the page.")
    src = src.replace(needle, POLYFILL + needle, 1)

    if 'id="venue"' in src or ">Nuptial Mass</h2>" in src:
        raise SystemExit("The venue sections are still in the print page.")

    rsvp = (
        '\n  <p class="pdf-rsvp">'
        f'<a class="countdown-cta" href="{RSVP_URL}">RSVP</a>'
        "</p>\n"
    )
    if "</footer>" not in src:
        raise SystemExit("Could not find the page footer.")
    src = src.replace("</footer>", rsvp + "</footer>", 1)

    HTML_OUT.write_text(src, encoding="utf-8")


def strip_section(html: str, section_id: str) -> str:
    pattern = rf'\s*<section id="{re.escape(section_id)}"[^>]*>.*?</section>'
    stripped, n = re.subn(pattern, "", html, count=1, flags=re.S)
    if n != 1:
        raise SystemExit(f"Could not remove #{section_id} from the print page.")
    return stripped


def strip_element_by_class(html: str, class_name: str) -> str:
    needle = f'class="{class_name}'
    start = html.find(needle)
    if start < 0:
        raise SystemExit(f"Could not find .{class_name} to remove.")
    open_tag = html.rfind("<", 0, start)
    if open_tag < 0:
        raise SystemExit(f"Could not find the opening tag for .{class_name}.")
    i = html.find(">", open_tag)
    depth = 1
    i += 1
    while i < len(html) and depth:
        next_open = html.find("<div", i)
        next_close = html.find("</div>", i)
        if next_close < 0:
            raise SystemExit(f"Could not close .{class_name}.")
        if next_open != -1 and next_open < next_close:
            depth += 1
            i = next_open + 4
        else:
            depth -= 1
            i = next_close + len("</div>")
    return html[:open_tag] + html[i:]


def keep_first_venue_photo(html: str) -> str:
    def repl(match: re.Match[str]) -> str:
        block = match.group(0)
        figures = re.findall(r"<figure class=\"venue-shot\">.*?</figure>", block, flags=re.S)
        if len(figures) < 2:
            return block
        open_end = block.find(">") + 1
        close = block.rfind("</div>")
        return block[:open_end] + "\n        " + figures[0] + "\n      " + block[close:]

    return re.sub(r'<div class="venue-photos[^"]*">.*?</div>', repl, html, flags=re.S)


def _brace_end(css: str, start: int) -> int:
    brace = css.find("{", start)
    if brace < 0:
        raise SystemExit("The invitation CSS has a rule without a body.")
    depth = 0
    for i in range(brace, len(css)):
        if css[i] == "{":
            depth += 1
        elif css[i] == "}":
            depth -= 1
            if depth == 0:
                return i + 1
    raise SystemExit("The invitation CSS has an unclosed rule.")


def scope_invitation_css(css: str) -> str:
    """Keep the card's own CSS from restyling the rest of the page."""
    media = css.find("@media")
    if media >= 0:
        css = css[:media] + css[_brace_end(css, media) :]
    out: list[str] = []
    i = 0
    while i < len(css):
        if css[i].isspace():
            out.append(css[i])
            i += 1
            continue
        end = _brace_end(css, i)
        if css.startswith("@font-face", i):
            out.append(css[i:end])
            i = end
            continue
        brace = css.find("{", i)
        selector = css[i:brace].strip()
        body = css[brace:end]
        if selector in {"*", "html,body", "html, body", "body"}:
            i = end
            continue
        if selector == ":root":
            selector = ".pdf-invite"
            body = body[:-1] + "padding:0;margin:0;background:#fff;--ink:#3D1534;--soft:#3D1534;}"
        else:
            selector = ", ".join(f".pdf-invite {part.strip()}" for part in selector.split(","))
        out.append(selector + body)
        i = end
    out.append(
        ".pdf-invite{padding:0!important;margin:0!important;background:#fff;}"
        ".pdf-invite .card{width:100%!important;max-width:none!important;margin:0!important;"
        "box-shadow:none!important;border:0!important;}"
        ".pdf-invite .card,.pdf-invite .card *{color:#3D1534!important;}"
    )
    return "".join(out)


def invitation_block() -> str:
    if not INVITE_HTML.exists():
        raise SystemExit(f"Could not find {INVITE_HTML.name}.")
    raw = INVITE_HTML.read_text(encoding="utf-8")
    style = re.search(r"<style>(.*)</style>", raw, flags=re.S)
    card = re.search(r'<main class="card">.*</main>', raw, flags=re.S)
    if style is None or card is None:
        raise SystemExit("The invitation HTML is missing its card or styles.")
    css = scope_invitation_css(style.group(1))
    markup = re.sub(r"\s*<svg\b.*?</svg>", "", card.group(0), count=1, flags=re.S)
    markup = re.sub(
        r"https://shannonpereira601\.github\.io/SaveTheDate/rsvp\.html(?:\?invite=reception)?",
        RSVP_URL,
        markup,
        count=1,
    )
    if "<svg" in markup:
        raise SystemExit("The QR code is still on the invitation.")
    return (
        '<section class="pdf-invite" aria-label="Wedding invitation">\n'
        f"<style>{css}</style>\n"
        f"{markup}\n"
        "</section>"
    )


def replace_welcome(html: str) -> str:
    pattern = r'\s*<section id="welcome"[^>]*>.*?</section>'
    html, n = re.subn(pattern, "\n" + invitation_block(), html, count=1, flags=re.S)
    if n != 1:
        raise SystemExit("Could not replace the You are invited section.")
    if "You are invited" in html:
        raise SystemExit("You are invited is still in the print page.")
    if "JOIN US" not in html:
        raise SystemExit("The invitation card is missing from the print page.")
    return html


def _div_end(html: str, open_tag: int) -> int:
    i = html.find(">", open_tag) + 1
    depth = 1
    while i < len(html) and depth:
        next_open = html.find("<div", i)
        next_close = html.find("</div>", i)
        if next_close < 0:
            raise SystemExit("Could not close a venue block.")
        if next_open != -1 and next_open < next_close:
            depth += 1
            i = next_open + 4
        else:
            depth -= 1
            i = next_close + len("</div>")
    return i


def arrange_venues(html: str) -> str:
    """Church first, titled Nuptial Mass, then Montego as Wedding Reception."""
    places: list[tuple[int, int]] = []
    start = 0
    while True:
        mark = html.find('class="venue-place"', start)
        if mark < 0:
            break
        open_tag = html.rfind("<", 0, mark)
        end = _div_end(html, open_tag)
        places.append((open_tag, end))
        start = end
    if len(places) != 2:
        raise SystemExit("Expected the church and Montego venue blocks.")
    first, second = places
    montego = html[first[0] : first[1]]
    church = html[second[0] : second[1]]
    if "lawn.jpg" not in montego or "church1.jpg" not in church:
        raise SystemExit("The venue blocks are not in the expected order.")
    church = church.replace(">Our Lady of the Sea Church</h2>", ">Nuptial Mass</h2>", 1)
    montego = montego.replace(">Montego Bay Beach Village</h2>", ">Wedding Reception</h2>", 1)
    if ">Nuptial Mass</h2>" not in church or ">Wedding Reception</h2>" not in montego:
        raise SystemExit("Could not retitle the venue sections.")
    return html[: first[0]] + church + "\n\n    " + montego + html[second[1] :]


def strip_print_only_content(html: str) -> str:
    html = strip_element_by_class(html, "hero-aside")
    marker = "</div><!-- /hero-grid -->"
    if marker not in html:
        raise SystemExit("Could not find the hero grid.")
    html = html.replace(
        marker,
        '<figure class="hero-silhouette" aria-hidden="true">'
        '<img src="silhouette.png" alt="">'
        "</figure>\n  " + marker,
        1,
    )
    html = replace_welcome(html)
    html = strip_section(html, "countdown")
    html = strip_section(html, "memory-lane")
    html = strip_section(html, "figures")
    html = strip_section(html, "faq")
    html = strip_section(html, "venue")
    html = strip_section(html, "itinerary")
    leftovers = []
    if "assets/img/photobooth" in html:
        leftovers.append("photobooth")
    if "Memory Lane" in html:
        leftovers.append("Memory Lane")
    if "Statistically speaking" in html:
        leftovers.append("Statistically speaking")
    if leftovers:
        raise SystemExit("Still in print page: " + ", ".join(leftovers))
    if "Frequently Asked Questions" in html:
        raise SystemExit("The FAQ is still in the print page.")
    if "invite-letter" in html or "A letter from us to you" in html:
        raise SystemExit("The letter is still in the print page.")
    if "igotone.png" in html:
        raise SystemExit("The letter illustration is still in the print page.")
    if "silhouette.png" not in html:
        raise SystemExit("The silhouette is missing from the hero.")
    if "Itinerary" in html:
        raise SystemExit("The itinerary is still in the print page.")
    if 'id="venue"' in html or ">Nuptial Mass</h2>" in html or ">Wedding Reception</h2>" in html:
        raise SystemExit("The venue sections are still in the print page.")
    return html


def print_pdf(browser: Path) -> None:
    if PDF_TMP.exists():
        PDF_TMP.unlink()
    uri = HTML_OUT.resolve().as_uri()
    subprocess.run(
        [
            str(browser),
            "--headless=new",
            "--disable-gpu",
            "--no-pdf-header-footer",
            "--hide-scrollbars",
            "--window-size=390,900",
            "--virtual-time-budget=8000",
            f"--print-to-pdf={PDF_TMP}",
            uri,
        ],
        check=False,
    )
    if not PDF_TMP.exists():
        raise SystemExit("Chrome did not write a PDF.")


def assert_name_order(text: str, lead: str) -> None:
    compact = re.sub(r"\s+", "", text)
    if "Youareinvited" in compact:
        raise SystemExit("You are invited is still in the PDF.")
    if "JOINUSTOCELEBRATEOURWEDDING" not in compact:
        raise SystemExit("The invitation card is missing from the PDF.")
    if "ShannonPereira" not in compact or "GloriaNoronha" not in compact:
        raise SystemExit("The invitation names are missing from the PDF.")
    if lead == "gloria" and ("Gloria&Shannon" not in compact or "Shannon&Gloria" in compact):
        raise SystemExit("The couple names are not in gloria-first order.")
    if lead == "shannon" and ("Shannon&Gloria" not in compact or "Gloria&Shannon" in compact):
        raise SystemExit("The couple names are not in shannon-first order.")


def crop_pdf(pdf_out: Path, lead: str) -> None:
    import pymupdf

    src = pymupdf.open(PDF_TMP)
    page = src[0]
    bottoms = [block[3] for block in page.get_text("blocks") if str(block[4]).strip()]
    if not bottoms:
        raise SystemExit("The PDF has no text.")
    height = min(max(bottoms) + 28, page.rect.height)
    clip = pymupdf.Rect(0, 0, page.rect.width, height)
    out = pymupdf.open()
    new_page = out.new_page(width=clip.width, height=clip.height)
    new_page.show_pdf_page(clip, src, 0, clip=clip)
    for block in new_page.get_text("blocks"):
        letters = "".join(ch for ch in str(block[4]) if ch.isalpha())
        if letters.upper() != "RSVP":
            continue
        rect = pymupdf.Rect(block[:4])
        cx = (rect.x0 + rect.x1) / 2
        cy = (rect.y0 + rect.y1) / 2
        hit = pymupdf.Rect(cx - 78, cy - 18, cx + 78, cy + 18)
        new_page.insert_link({"kind": pymupdf.LINK_URI, "from": hit, "uri": RSVP_URL})
    out.save(pdf_out, garbage=4, deflate=True)
    src.close()
    out.close()
    saved = pymupdf.open(pdf_out)
    text = saved[0].get_text()
    compact = re.sub(r"\s+", "", text)
    uris = [link.get("uri") for link in saved[0].get_links()]
    if RSVP_URL not in uris:
        raise SystemExit("The RSVP button is not a link.")
    if any("rsvp.html" in (uri or "") and uri != RSVP_URL for uri in uris):
        raise SystemExit("An RSVP link does not unlock the reception page.")
    if "Roce" in text:
        raise SystemExit("Roce text leaked into the reception PDF.")
    if "Oxel,Siolim" in compact or "VithaldasWaddo" in compact:
        raise SystemExit("The venue sections are still in the PDF.")
    if "RSVP" not in compact:
        raise SystemExit("The RSVP link is missing from the PDF.")
    if "Ourforeverbegins" in compact:
        raise SystemExit("The countdown is still in the PDF.")
    if "MemoryLane" in compact:
        raise SystemExit("Memory Lane is still in the PDF.")
    if "Itinerary" in text or "Guestsarrive" in compact:
        raise SystemExit("The itinerary is still in the PDF.")
    if "Statistically" in compact:
        raise SystemExit("Statistically speaking is still in the PDF.")
    if "FrequentlyAsked" in compact:
        raise SystemExit("The FAQ is still in the PDF.")
    if "Aletterfromustoyou" in compact or "Thisismorethanjustacelebration" in compact:
        raise SystemExit("The letter is still in the PDF.")
    assert_name_order(text, lead)
    print(f"Wrote {pdf_out}")
    print(f"Size {pdf_out.stat().st_size / 1_000_000:.1f} MB, one page.")


def main() -> None:
    browser = find_browser()
    print(f"Using {browser.name}")
    prepare_silhouette()
    for lead in ("gloria", "shannon"):
        build_html(lead)
        print(f"Printing {lead}-first...")
        print_pdf(browser)
        crop_pdf(PDFS[lead], lead)


if __name__ == "__main__":
    main()
