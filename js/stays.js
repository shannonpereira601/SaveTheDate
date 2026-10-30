/* Stays for stay.html.
   Prices are per night, taxes included, for 17–20 Dec 2026, checked 29 Oct 2026.
   lat/lng come from public listings. approx: the pin is the area, not the door.
   Travel times are the ones we checked, not a new route calculation. */

var STAYS = [
  {
    id: "aloha",
    name: "Aloha by the Sea",
    type: "hotel",
    tier: "budget",
    priceLow: 2500,
    priceHigh: 3000,
    distance: "4 min walk",
    minutes: 4,
    travel: "walk",
    rating: 4.2,
    ratingSort: 4.2,
    ratingCount: 131,
    ratingScale: 5,
    ratingSource: "Google",
    phone: "+919892981762",
    phoneText: "+91 98929 81762",
    bookLabel: "Call",
    bookNote: "Family friend · Mention Shannon’s name",
    lat: 15.6301322,
    lng: 73.729923,
    mapQuery: "Aloha by the Sea, Vithaldas Wada, Morjim Beach Road, Morjim, Goa"
  },
  {
    id: "whoopers",
    name: "Whoopers Boutique Hotel",
    type: "hotel",
    tier: "budget",
    priceLow: 2314,
    priceHigh: 4408,
    distance: "5 min drive",
    minutes: 5,
    travel: "drive",
    rating: 4.8,
    ratingSort: 4.8,
    ratingCount: 1753,
    ratingScale: 5,
    ratingSource: "Google",
    bookUrl: "https://www.booking.com/hotel/in/whoopers-boutique-morjim.html?checkin=2026-12-17&checkout=2026-12-20&group_adults=2&selected_currency=INR",
    lat: 15.639277,
    lng: 73.723827,
    mapQuery: "Whoopers Boutique Hotel, Morjim, Goa"
  },
  {
    id: "bodhi",
    name: "The Bodhi Tree Resort",
    type: "hotel",
    tier: "budget",
    priceLow: 1962,
    priceHigh: 2886,
    distance: "5 min drive",
    minutes: 5,
    travel: "drive",
    rating: 4.8,
    ratingSort: 4.8,
    ratingCount: 302,
    ratingScale: 5,
    ratingSource: "Google",
    bookUrl: "https://www.booking.com/hotel/in/the-bodhi-tree-resort-morjim.html?checkin=2026-12-17&checkout=2026-12-20&group_adults=2&selected_currency=INR",
    lat: 15.618538,
    lng: 73.735972,
    mapQuery: "The Bodhi Tree Resort, Morjim, Goa"
  },
  {
    id: "orange",
    name: "Orange Villa",
    type: "hotel",
    tier: "budget",
    priceLow: 1418,
    priceHigh: 2363,
    distance: "12 min walk",
    minutes: 12,
    travel: "walk",
    rating: 8.9,
    ratingSort: 4.45,
    ratingCount: 152,
    ratingScale: 10,
    ratingSource: "Booking.com",
    bookUrl: "https://www.booking.com/hotel/in/aparthotel-orange-village-morjim.html?checkin=2026-12-17&checkout=2026-12-20&group_adults=2&selected_currency=INR",
    lat: 15.625851,
    lng: 73.736006,
    mapQuery: "Orange Villa, Morjim Beach, Morjim, Goa"
  },
  {
    id: "beach-walk",
    name: "Beach Walk Resort",
    type: "hotel",
    tier: "mid",
    priceLow: 8007,
    priceHigh: 9455,
    distance: "Next door",
    minutes: 0,
    travel: "walk",
    rating: 4.0,
    ratingSort: 4.0,
    ratingCount: 170,
    ratingScale: 5,
    ratingSource: "Google",
    bookUrl: "https://www.booking.com/hotel/in/treebo-trend-beach-walk.html?checkin=2026-12-17&checkout=2026-12-20&group_adults=2&selected_currency=INR",
    lat: 15.62872,
    lng: 73.728859,
    mapQuery: "Beach Walk Resort, House No 824, Vithaldas Waddo, Morjim, Goa"
  },
  {
    id: "amore",
    name: "Hotel Amore Mio (beachfront)",
    type: "hotel",
    tier: "mid",
    priceLow: 6484,
    priceHigh: 9902,
    distance: "5 min walk",
    minutes: 5,
    travel: "walk",
    rating: 4.9,
    ratingSort: 4.9,
    ratingCount: 200,
    ratingScale: 5,
    ratingSource: "Google",
    bookUrl: "https://www.booking.com/hotel/in/amore-mio-morjim.html?checkin=2026-12-17&checkout=2026-12-20&group_adults=2&selected_currency=INR",
    lat: 15.630123,
    lng: 73.72552,
    mapQuery: "Hotel Amore Mio, Morjim Beach Road, Morjim, Goa"
  },
  {
    id: "artist",
    name: "The Artist Cottages",
    type: "hotel",
    tier: "mid",
    priceLow: 6345,
    priceHigh: null,
    distance: "12 min walk",
    minutes: 12,
    travel: "walk",
    rating: 4.6,
    ratingSort: 4.6,
    ratingCount: 168,
    ratingScale: 5,
    ratingSource: "Google",
    bookUrl: "https://www.booking.com/hotel/in/the-artist-cottages.html?checkin=2026-12-17&checkout=2026-12-20&group_adults=2&selected_currency=INR",
    lat: 15.634523,
    lng: 73.723598,
    mapQuery: "The Artist Cottages, Gawde Wada, Morjim, Goa"
  },
  {
    id: "twelve-palm",
    name: "The Twelve Palm Resort",
    type: "hotel",
    tier: "mid",
    priceLow: 4094,
    priceHigh: 4286,
    distance: "4 min drive",
    minutes: 4,
    travel: "drive",
    rating: 4.9,
    ratingSort: 4.9,
    ratingCount: 150,
    ratingScale: 5,
    ratingSource: "Google",
    bookUrl: "https://www.booking.com/hotel/in/the-twelve-palm-resort.html?checkin=2026-12-17&checkout=2026-12-20&group_adults=2&selected_currency=INR",
    lat: 15.624775,
    lng: 73.738591,
    mapQuery: "The Twelve Palm Resort, Kennaikwada, Morjim, Goa"
  },
  {
    id: "justa",
    name: "jüSTa Morjim Beach Resort",
    type: "hotel",
    tier: "premium",
    priceLow: 12203,
    priceHigh: 17492,
    distance: "3 min walk",
    minutes: 3,
    travel: "walk",
    rating: 4.5,
    ratingSort: 4.5,
    ratingCount: 490,
    ratingScale: 5,
    ratingSource: "Google",
    bookUrl: "https://www.booking.com/hotel/in/justa-morjim-beach-resort-goa.html?checkin=2026-12-17&checkout=2026-12-20&group_adults=2&selected_currency=INR",
    lat: 15.629814,
    lng: 73.727125,
    mapQuery: "jüSTa Morjim Beach Resort, Vithaldaswada, Morjim, Goa"
  },
  {
    id: "acacia",
    name: "The Acacia Resort & Spa",
    type: "hotel",
    tier: "premium",
    priceLow: 11330,
    priceHigh: 13467,
    distance: "5 min drive",
    minutes: 5,
    travel: "drive",
    rating: 4.3,
    ratingSort: 4.3,
    ratingCount: 1144,
    ratingScale: 5,
    ratingSource: "Google",
    bookUrl: "https://www.booking.com/hotel/in/the-acacia-resort-morjim-goa.html?checkin=2026-12-17&checkout=2026-12-20&group_adults=2&selected_currency=INR",
    lat: 15.638649,
    lng: 73.724115,
    mapQuery: "The Acacia Resort and Spa, Morjim, Goa"
  },
  {
    id: "azora",
    name: "Azora by Ayatana",
    type: "hotel",
    tier: "premium",
    priceLow: 17433,
    priceHigh: 22217,
    distance: "5 min drive",
    minutes: 5,
    travel: "drive",
    rating: 4.8,
    ratingSort: 4.8,
    ratingCount: 867,
    ratingScale: 5,
    ratingSource: "Google",
    bookUrl: "https://www.booking.com/hotel/in/azorab-by-ayatana-goa.html?checkin=2026-12-17&checkout=2026-12-20&group_adults=2&selected_currency=INR",
    lat: 15.642006,
    lng: 73.721873,
    mapQuery: "Azora by Ayatana, Ashvem, Morjim, Goa"
  },
  {
    id: "marbela",
    name: "Marbela Beach Resort",
    type: "hotel",
    tier: "premium",
    priceLow: 12367,
    priceHigh: 31093,
    distance: "5 min drive",
    minutes: 5,
    travel: "drive",
    rating: 4.2,
    ratingSort: 4.2,
    ratingCount: 4204,
    ratingScale: 5,
    ratingSource: "Google",
    bookUrl: "https://www.booking.com/hotel/in/marbela-beach-resort.html?checkin=2026-12-17&checkout=2026-12-20&group_adults=2&selected_currency=INR",
    lat: 15.638082,
    lng: 73.720674,
    mapQuery: "Marbela Beach Resort, Morjim, Goa"
  },
  {
    id: "riverside",
    name: "Cute Riverside Cottage, Morjim",
    type: "airbnb",
    tier: "budget",
    priceLow: 2500,
    priceHigh: null,
    sleeps: "2",
    distance: "5 min drive",
    minutes: 5,
    travel: "drive",
    rating: 4.62,
    ratingSort: 4.62,
    ratingCount: 114,
    ratingScale: 5,
    ratingSource: "Airbnb",
    bookUrl: "https://www.airbnb.co.in/rooms/49289724?check_in=2026-12-17&check_out=2026-12-20&adults=2",
    lat: 15.622638,
    lng: 73.73245,
    mapQuery: "Cute Riverside Cottage, Morjim, Goa"
  },
  {
    id: "mangrove",
    name: "South Mangrove Studio, Siolim",
    type: "airbnb",
    tier: "budget",
    priceLow: 3550,
    priceHigh: null,
    sleeps: "2",
    distance: "12 min drive",
    minutes: 12,
    travel: "drive",
    rating: 4.85,
    ratingSort: 4.85,
    ratingCount: 105,
    ratingScale: 5,
    ratingSource: "Airbnb",
    bookUrl: "https://www.airbnb.co.in/rooms/1232723002021213382?check_in=2026-12-17&check_out=2026-12-20&adults=2",
    lat: 15.618823,
    lng: 73.758093,
    mapQuery: "South Mangrove Studio, Siolim, Goa"
  },
  {
    id: "riviera",
    name: "Studio at Riviera Sapphire, Siolim",
    type: "airbnb",
    tier: "budget",
    priceLow: 3110,
    priceHigh: null,
    sleeps: "2",
    distance: "15 min drive",
    minutes: 15,
    travel: "drive",
    rating: 4.72,
    ratingSort: 4.72,
    ratingCount: 159,
    ratingScale: 5,
    ratingSource: "Airbnb",
    bookUrl: "https://www.airbnb.co.in/rooms/10683847?check_in=2026-12-17&check_out=2026-12-20&adults=2",
    lat: 15.619505,
    lng: 73.773451,
    mapQuery: "Riviera Sapphire, Bamon Vaddo, Siolim, Goa"
  },
  {
    id: "ashwem-3bhk",
    name: "Ashwem Beach-view 3BHK",
    type: "airbnb",
    tier: "mid",
    priceLow: 9450,
    priceHigh: null,
    sleeps: "4+",
    distance: "6 min drive",
    minutes: 6,
    travel: "drive",
    rating: 4.92,
    ratingSort: 4.92,
    ratingCount: 284,
    ratingScale: 5,
    ratingSource: "Airbnb",
    bookUrl: "https://www.airbnb.co.in/rooms/21617506?check_in=2026-12-17&check_out=2026-12-20&adults=4",
    lat: 15.648,
    lng: 73.7185,
    approx: true,
    mapQuery: "Ashwem Beach, Goa"
  },
  {
    id: "ashwem-2br",
    name: "Ashwem Beach 2BR Flat",
    type: "airbnb",
    tier: "mid",
    priceLow: 9370,
    priceHigh: null,
    sleeps: "4",
    distance: "8 min drive",
    minutes: 8,
    travel: "drive",
    rating: 4.86,
    ratingSort: 4.86,
    ratingCount: 240,
    ratingScale: 5,
    ratingSource: "Airbnb",
    bookUrl: "https://www.airbnb.co.in/rooms/5166941?check_in=2026-12-17&check_out=2026-12-20&adults=4",
    lat: 15.6545,
    lng: 73.7215,
    approx: true,
    mapQuery: "Ashwem Beach, Goa"
  },
  {
    id: "chic-siolim",
    name: "Chic 2BHK with Pool, Siolim",
    type: "airbnb",
    tier: "mid",
    priceLow: 7330,
    priceHigh: null,
    sleeps: "4",
    distance: "15 min drive",
    minutes: 15,
    travel: "drive",
    rating: 4.83,
    ratingSort: 4.83,
    ratingCount: 119,
    ratingScale: 5,
    ratingSource: "Airbnb",
    bookUrl: "https://www.airbnb.co.in/rooms/975910766033105279?check_in=2026-12-17&check_out=2026-12-20&adults=4",
    lat: 15.624,
    lng: 73.769,
    approx: true,
    mapQuery: "Siolim, Goa"
  },
  {
    id: "riverfront",
    name: "Riverfront 1BHK Villa, Siolim",
    type: "airbnb",
    tier: "mid",
    priceLow: 5600,
    priceHigh: null,
    sleeps: "2",
    distance: "12 min drive",
    minutes: 12,
    travel: "drive",
    rating: 4.93,
    ratingSort: 4.93,
    ratingCount: 110,
    ratingScale: 5,
    ratingSource: "Airbnb",
    bookUrl: "https://www.airbnb.co.in/rooms/1019322401545227380?check_in=2026-12-17&check_out=2026-12-20&adults=2",
    lat: 15.621,
    lng: 73.7585,
    approx: true,
    mapQuery: "Siolim, Goa"
  },
  {
    id: "river-villa",
    name: "Morjim River Villa 2",
    type: "airbnb",
    tier: "premium",
    priceLow: 10520,
    priceHigh: null,
    sleeps: "2",
    distance: "5 min drive",
    minutes: 5,
    travel: "drive",
    rating: 4.82,
    ratingSort: 4.82,
    ratingCount: 148,
    ratingScale: 5,
    ratingSource: "Airbnb",
    bookUrl: "https://www.airbnb.co.in/rooms/23735064?check_in=2026-12-17&check_out=2026-12-20&adults=2",
    lat: 15.626453,
    lng: 73.743915,
    mapQuery: "Morjim River Villa, Morjim, Goa"
  },
  {
    id: "charming",
    name: "Charming 2BHK with Pool, Morjim",
    type: "airbnb",
    tier: "premium",
    priceLow: 10340,
    priceHigh: null,
    sleeps: "4",
    distance: "5 min drive",
    minutes: 5,
    travel: "drive",
    rating: 4.7,
    ratingSort: 4.7,
    ratingCount: 115,
    ratingScale: 5,
    ratingSource: "Airbnb",
    bookUrl: "https://www.airbnb.co.in/rooms/1252815083628656139?check_in=2026-12-17&check_out=2026-12-20&adults=4",
    lat: 15.6335,
    lng: 73.741,
    approx: true,
    mapQuery: "Morjim, Goa"
  },
  {
    id: "radha",
    name: "Radha House, Siolim",
    type: "airbnb",
    tier: "premium",
    priceLow: 12000,
    priceHigh: null,
    sleeps: "2",
    distance: "15 min drive",
    minutes: 15,
    travel: "drive",
    rating: 4.94,
    ratingSort: 4.94,
    ratingCount: 322,
    ratingScale: 5,
    ratingSource: "Airbnb",
    bookUrl: "https://www.airbnb.co.in/rooms/1220170819303634493?check_in=2026-12-17&check_out=2026-12-20&adults=2",
    lat: 15.620172,
    lng: 73.768611,
    mapQuery: "Radha House, Siolim, Goa"
  },
  {
    id: "amber",
    name: "Amber Glasshouse Suite, Siolim",
    type: "airbnb",
    tier: "premium",
    priceLow: 13740,
    priceHigh: null,
    sleeps: "2",
    distance: "12 min drive",
    minutes: 12,
    travel: "drive",
    rating: 4.95,
    ratingSort: 4.95,
    ratingCount: 156,
    ratingScale: 5,
    ratingSource: "Airbnb",
    bookUrl: "https://www.airbnb.co.in/rooms/921031497596682581?check_in=2026-12-17&check_out=2026-12-20&adults=2",
    lat: 15.622633,
    lng: 73.76772,
    mapQuery: "Amber Glasshouse, Siolim, Goa"
  }
];

var VENUE = { lat: 15.6277051, lng: 73.7284384, name: "Montego Bay Beach Village" };

var TYPE_LABEL = { hotel: "Hotels", airbnb: "Airbnbs" };
var TIER_LABEL = { budget: "Budget", mid: "Mid-range", premium: "Premium" };
var TYPE_ORDER = ["hotel", "airbnb"];
var TIER_ORDER = ["budget", "mid", "premium"];

var state = { view: "list", type: "all", tier: "all", sort: "recommended" };
var map;
var stayLayer;
var filteredCache = [];

function inr(n) {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

function formatRange(low, high) {
  if (high == null || high === low) return inr(low);
  return inr(low) + "–" + inr(high).slice(1);
}

function whoFor(stay) {
  if (stay.type === "hotel") return "Room for 2";
  return "Sleeps " + stay.sleeps;
}

function distanceRank(stay) {
  return stay.minutes * 2 + (stay.travel === "drive" ? 1 : 0);
}

function esc(value) {
  return String(value).replace(/[&<>"']/g, function (ch) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
  });
}

var SEP = '<span class="sep" aria-hidden="true">·</span>';

function starSvg() {
  return '<svg class="star" viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M8 1.2l1.76 3.84 4.2.48-3.12 2.88.86 4.16L8 10.55 4.3 12.56l.86-4.16L2.04 5.52l4.2-.48z"/></svg>';
}

function travelSvg(travel) {
  if (travel === "walk") {
    return '<svg class="travel-icon" viewBox="0 0 16 16" aria-hidden="true"><circle cx="9" cy="2.5" r="1.5" fill="currentColor"/><path d="M7.2 5.5 5.5 9.5l2.3 1.2.7 4.3M7.2 5.5l2.3.6 1.2 2.6 1.8.8M7.8 10.7 5.8 15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }
  return '<svg class="travel-icon" viewBox="0 0 16 16" aria-hidden="true"><path d="M2.5 9.5 4 5.5a1.5 1.5 0 0 1 1.4-1h5.2a1.5 1.5 0 0 1 1.4 1l1.5 4v3h-11z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><circle cx="5" cy="10.5" r="1" fill="currentColor"/><circle cx="11" cy="10.5" r="1" fill="currentColor"/></svg>';
}

function ratingHtml(stay) {
  var count = stay.ratingCount.toLocaleString("en-IN");
  if (stay.ratingScale === 10) {
    return esc(stay.rating.toFixed(1)) + "/10 (" + count + ")";
  }
  var score = stay.rating % 1 === 0 ? stay.rating.toFixed(1) : String(stay.rating);
  return starSvg() + esc(score) + " (" + count + ")";
}

function directionsUrl(stay) {
  var origin = "Montego Bay Beach Village, Vithaldas Waddo, Morjim, Goa";
  var mode = stay.travel === "walk" ? "walking" : "driving";
  return "https://www.google.com/maps/dir/?api=1&origin=" + encodeURIComponent(origin) +
    "&destination=" + encodeURIComponent(stay.mapQuery) + "&travelmode=" + mode;
}

function bookHref(stay) {
  return stay.phone ? "tel:" + stay.phone : stay.bookUrl;
}

function actionsHtml(stay) {
  return '<a class="btn btn--solid" href="' + esc(bookHref(stay)) + '"' +
    (stay.phone ? "" : ' target="_blank" rel="noopener noreferrer"') + ">" +
    esc(stay.bookLabel || "Book") + "</a>" +
    '<a class="btn btn--ghost" href="' + esc(directionsUrl(stay)) + '" target="_blank" rel="noopener noreferrer">Directions</a>';
}

function matches(stay) {
  if (state.type !== "all" && stay.type !== state.type) return false;
  if (state.tier !== "all" && stay.tier !== state.tier) return false;
  return true;
}

function visibleStays() {
  var list = STAYS.filter(matches);
  if (state.sort === "closest") {
    list.sort(function (a, b) { return distanceRank(a) - distanceRank(b) || a.order - b.order; });
  } else if (state.sort === "price") {
    list.sort(function (a, b) { return a.priceLow - b.priceLow || a.order - b.order; });
  } else if (state.sort === "rating") {
    list.sort(function (a, b) { return b.ratingSort - a.ratingSort || a.order - b.order; });
  }
  return list;
}

function grouped() {
  return state.sort === "recommended";
}

function cardHtml(stay, showKind) {
  var meta = [];
  if (showKind) meta.push(esc(stay.type === "hotel" ? "Hotel" : "Airbnb"));
  meta.push(esc(whoFor(stay)));
  meta.push(ratingHtml(stay));
  var heading = showKind ? "h3" : "h4";
  var note = stay.bookNote ? '<p class="stay-note">' + esc(stay.bookNote) + "</p>" : "";
  // tel: links do nothing on most desktops, so the number is also written out.
  if (stay.phone) note += '<p class="stay-phone">Ashay: <a href="tel:' + esc(stay.phone) + '">' + esc(stay.phoneText) + "</a></p>";
  return '<article class="stay">' +
    '<div class="stay-copy"><' + heading + ' class="stay-name">' + esc(stay.name) + "</" + heading + ">" +
    '<p class="stay-meta">' + meta.join(SEP) + "</p>" + note + "</div>" +
    '<div class="stay-side">' +
    '<p class="stay-price">' + esc(formatRange(stay.priceLow, stay.priceHigh)) + "</p>" +
    '<p class="stay-per">per night</p>' +
    '<p class="stay-dist">' + travelSvg(stay.travel) + esc(stay.distance) + "</p></div>" +
    '<div class="stay-actions">' + actionsHtml(stay) + "</div>" +
    "</article>";
}

function listHtml(list) {
  if (!list.length) {
    return '<div class="empty"><h2 class="empty-title">Nothing in this combination</h2>' +
      '<p class="empty-copy">Try another price or type of stay.</p>' +
      '<button class="btn btn--solid" type="button" data-clear>Show every stay</button></div>';
  }
  if (!grouped()) {
    return '<div class="stay-list">' + list.map(function (stay) { return cardHtml(stay, true); }).join("") + "</div>";
  }
  var html = "";
  TYPE_ORDER.forEach(function (type) {
    var ofType = list.filter(function (stay) { return stay.type === type; });
    if (!ofType.length) return;
    html += '<section class="stay-group"><h2 class="group-title">' + TYPE_LABEL[type] + "</h2>";
    TIER_ORDER.forEach(function (tier) {
      var items = ofType.filter(function (stay) { return stay.tier === tier; });
      if (!items.length) return;
      html += '<h3 class="tier-title">' + TIER_LABEL[tier] + "</h3>" +
        '<div class="stay-list">' + items.map(function (stay) { return cardHtml(stay, false); }).join("") + "</div>";
    });
    html += "</section>";
  });
  return html;
}

function popupHtml(stay) {
  return '<p class="pop-name">' + esc(stay.name) + "</p>" +
    '<p class="pop-line"><span class="pop-price">' + esc(formatRange(stay.priceLow, stay.priceHigh)) + "</span> / night</p>" +
    '<p class="pop-line">' + esc(stay.distance) + " · " + esc(whoFor(stay)) + "</p>" +
    (stay.phone ? '<p class="pop-line">' + esc(stay.bookNote) + "<br>Ashay: " + esc(stay.phoneText) + "</p>" : "") +
    (stay.approx ? '<p class="pop-line pop-approx">Pin is approximate</p>' : "") +
    '<p class="pop-actions">' + actionsHtml(stay) + "</p>";
}

function pinIcon(kind) {
  var size = kind === "venue" ? 20 : 16;
  return L.divIcon({
    className: "pin pin--" + kind,
    html: '<span class="pin-dot"></span>',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2]
  });
}

function fitMap() {
  if (!map) return;
  var points = [L.latLng(VENUE.lat, VENUE.lng)];
  filteredCache.forEach(function (stay) { points.push(L.latLng(stay.lat, stay.lng)); });
  map.fitBounds(L.latLngBounds(points), { padding: [20, 20], maxZoom: 15 });
}

function renderPins() {
  if (!map || !stayLayer) return;
  map.closePopup();
  stayLayer.clearLayers();
  filteredCache.forEach(function (stay) {
    var kind = stay.type === "hotel" ? "hotel" : "airbnb";
    L.marker([stay.lat, stay.lng], { icon: pinIcon(kind), title: stay.name, alt: stay.name })
      .bindPopup(popupHtml(stay), { maxWidth: 260, minWidth: 220, autoPanPaddingTopLeft: [12, 60] })
      .addTo(stayLayer);
  });
}

function ensureMap() {
  var mount = document.getElementById("stay-map");
  if (map) return;
  if (typeof L === "undefined") {
    mount.innerHTML = '<p class="map-fallback">The map could not load. Use the list view — Directions on each stay open Google Maps.</p>';
    return;
  }
  map = L.map(mount, { scrollWheelZoom: false, zoomSnap: 0.25 });
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
  L.marker([VENUE.lat, VENUE.lng], { icon: pinIcon("venue"), title: VENUE.name, alt: VENUE.name, zIndexOffset: 1000 })
    .bindPopup('<p class="pop-name">Montego Bay Beach Village</p><p class="pop-line">The venue</p>')
    .addTo(map);
  stayLayer = L.layerGroup().addTo(map);
  map.setView([VENUE.lat, VENUE.lng], 14);
}

// Once the controls are stuck, a new view or filter should start at its top, not mid-page.
function scrollToResults() {
  var mast = document.querySelector(".stay-mast");
  if (window.scrollY > mast.offsetHeight) window.scrollTo(0, mast.offsetHeight);
}

function syncControlsHeight() {
  var bar = document.getElementById("stay-controls");
  document.documentElement.style.setProperty("--controls-h", bar.offsetHeight + "px");
}

function syncControls() {
  document.querySelectorAll("[data-view]").forEach(function (button) {
    button.setAttribute("aria-pressed", button.getAttribute("data-view") === state.view ? "true" : "false");
  });
  document.querySelectorAll("[data-filter]").forEach(function (button) {
    var on = state[button.getAttribute("data-filter")] === button.getAttribute("data-value");
    button.setAttribute("aria-pressed", on ? "true" : "false");
  });
  document.getElementById("stay-sort").value = state.sort;
  // Sorting means nothing on a map.
  document.querySelector(".sort-label").hidden = state.view === "map";
}

function render() {
  filteredCache = visibleStays();
  var count = filteredCache.length;
  document.getElementById("result-count").textContent = count + " " + (count === 1 ? "place" : "places");
  var results = document.getElementById("stay-results");
  var mapWrap = document.getElementById("map-wrap");
  var showMap = state.view === "map" && count > 0;

  results.hidden = showMap;
  results.innerHTML = showMap ? "" : listHtml(filteredCache);
  mapWrap.hidden = !showMap;
  if (!showMap) return;

  ensureMap();
  if (!map) return;
  renderPins();
  // The map was display:none until now, so Leaflet needs its real size before fitting.
  window.requestAnimationFrame(function () {
    map.invalidateSize();
    fitMap();
  });
}

document.addEventListener("DOMContentLoaded", function () {
  STAYS.forEach(function (stay, index) { stay.order = index; });

  document.getElementById("stay-controls").addEventListener("click", function (event) {
    var view = event.target.closest("[data-view]");
    if (view) {
      state.view = view.getAttribute("data-view");
    } else {
      var chip = event.target.closest("[data-filter]");
      if (!chip) return;
      // Tapping the active chip again clears that filter.
      var key = chip.getAttribute("data-filter");
      var value = chip.getAttribute("data-value");
      state[key] = state[key] === value ? "all" : value;
    }
    syncControls();
    render();
    scrollToResults();
  });

  document.getElementById("stay-sort").addEventListener("change", function () {
    state.sort = this.value;
    render();
    scrollToResults();
  });

  document.getElementById("stay-results").addEventListener("click", function (event) {
    if (!event.target.closest("[data-clear]")) return;
    state.type = "all";
    state.tier = "all";
    syncControls();
    render();
  });

  syncControlsHeight();
  window.addEventListener("resize", function () {
    syncControlsHeight();
    if (map && state.view === "map") map.invalidateSize();
  });

  syncControls();
  render();
});
