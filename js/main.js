/* Site behaviour: jQuery + vanilla JS. Every page still reads fine with scripts off. */
(function ($) {
  "use strict";

  $("html").removeClass("no-js");

  /* Mobile menu */
  var $btn = $(".menu-btn");
  var $nav = $("#site-nav");
  $btn.on("click", function () {
    var open = !$nav.hasClass("open");
    $nav.toggleClass("open", open);
    $btn.attr("aria-expanded", open).text(open ? "Close" : "Menu");
  });
  $(document).on("keydown", function (e) {
    if (e.key === "Escape" && $nav.hasClass("open")) {
      $nav.removeClass("open");
      $btn.attr("aria-expanded", "false").text("Menu").trigger("focus");
    }
  });

  /* Scroll reveal (skipped when the browser lacks support) */
  var $reveal = $(".reveal");
  if ("IntersectionObserver" in window && $reveal.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          $(en.target).addClass("in");
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    $reveal.each(function () { io.observe(this); });
  } else {
    $reveal.addClass("in");
  }

  /* Resume: filter skills by group */
  $(".skill-tools").on("click", ".chip", function () {
    var group = $(this).data("group");
    $(".skill-tools .chip").attr("aria-pressed", "false");
    $(this).attr("aria-pressed", "true");
    $(".skill-list li").each(function () {
      var show = group === "all" || $(this).data("group") === group;
      $(this).prop("hidden", !show);
    });
  });

  /* Print / save as PDF */
  $("[data-print]").on("click", function () { window.print(); });

  /* Copy email */
  $("[data-copy]").on("click", function () {
    var $b = $(this);
    var text = $b.data("copy");
    var done = function (msg) {
      var old = $b.data("label") || $b.text();
      $b.data("label", old).text(msg);
      setTimeout(function () { $b.text(old); }, 1600);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { done("Copied"); }, function () { done("Select and copy"); });
    } else {
      done("Select and copy");
    }
  });

  /* Contact form: opens the visitor's own mail app with the message filled in.
     No server is involved, so nothing pretends to be "sent". */
  $("#contact-form").on("submit", function (e) {
    e.preventDefault();
    var name = $.trim($("#c-name").val());
    var from = $.trim($("#c-email").val());
    var msg = $.trim($("#c-msg").val());
    var to = $(this).data("to");
    var subject = "Portfolio message from " + name;
    var body = msg + "\n\n" + name + (from ? "\n" + from : "");
    window.location.href = "mailto:" + to + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  });
})(jQuery);
