/*
  :copyright: 2020, ExonLabs. All rights reserved.
  :license: BSD, see LICENSE for more details.
*/
var WebUI = function($, ui) {

  ui.scrolltop = function(interval) {
    $("#board-page").animate({scrollTop:0},(interval)?interval:300);
  };

  ui.board_menu = {
    show: function() {
      $("body").addClass("MenuToggled");
    },
    hide: function() {
      $("body").removeClass("MenuToggled");
    },
    toggle: function() {
      $("body").toggleClass("MenuToggled");
    }
  };

  ui.board_content = {
    old_hash: null,
    load_neglect: false,
    update: function(data) {
      $("#pagebody-contents").html(data);
      ui.scrolltop(0);
    },
    error: function(message) {
      ui.board_content.update(
        '<div class="p-3"><div class="alert alert-danger text-left">' +
        '<i class="fas fa-ta fa-exclamation-circle"></i> ' + message + '</div></div>');
    },
    warn: function(message) {
      ui.board_content.update(
        '<div class="p-3"><div class="alert alert-warning text-left">' +
        '<i class="fas fa-ta fa-exclamation-circle"></i> ' + message + '</div></div>');
    },
    info: function(message) {
      ui.board_content.update(
        '<div class="p-3"><div class="alert alert-info text-left">' +
        '<i class="fas fa-ta fa-info-circle"></i> ' + message + '</div></div>');
    },
    success: function(message) {
      ui.board_content.update(
        '<div class="p-3"><div class="alert alert-success text-left">' +
        '<i class="fas fa-ta fa-check-circle"></i> ' + message + '</div></div>');
    },
    load: function(verb, url, params) {
      if(ui.board_content.load_neglect) {
        ui.board_content.load_neglect = false;
        return null;
      };
      ui.loader.load(verb, url, params,
        function(result) {
          ui.board_content.old_hash = window.location.hash;
          if(result.redirect) ui.redirect(result.redirect, result.blank);
          else {
            if(result.doctitle) ui.doctitle.update(result.doctitle);
            if(result.notifications) ui.notify.load(result.notifications);
            if(result.payload !== undefined) ui.board_content.update(result.payload);
          };
        },
        function(error) {
          ui.notify.error(error);
          if(ui.board_content.old_hash) {
            ui.board_content.load_neglect = true;
            window.location.hash = ui.board_content.old_hash;
          };
        });
    }
  };

  ui.board_init = function() {
    ui.init();

    $(window)
      .bind("resize", function() {
        if(window.innerWidth < 992) ui.board_menu.hide();
      })
      .bind("hashchange", function(e) {
        e.preventDefault();
        if(window.innerWidth < 992) ui.board_menu.hide();
        ui.board_content.load("GET", window.location.hash, null);
      });

    $("#board-menubody>ul.metismenu").metisMenu();
    $('#board-menubody a.pagelink[href="' +
        window.location.hash.replace(/[\/?].*$/,"") + '"]')
      .parents('ul').prev('a').click();

    $("body")
      .on("click", "a.pagelink", function(e) {
        e.preventDefault();
        ui.redirect($(this).attr("href"));
      });

    $("#board-menutoggle>a")
      .bind("click", function(e) {
        e.preventDefault();
        ui.board_menu.toggle();
      });

    $("#board-backdrop")
      .bind('click', function(e) {
        e.preventDefault();
        ui.board_menu.hide();
      });

    setTimeout(function() {
      if(window.location.hash.length <= 1) {
        window.location.hash = $('#board-menubody a.pagelink').attr("href");
      }
      else $(window).trigger("hashchange");
    }, 100);
  };

  return ui;
}(jQuery, WebUI || {});
