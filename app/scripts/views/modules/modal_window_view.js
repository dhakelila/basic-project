define([
  'jquery',
  'underscore',
  'backbone',
  'handlebars',
  'text!templates/modal_window_tpl.hbs'
], function($, _, Backbone, Handlebars, tpl) {

  'use strict';

  var ModalWindowView = Backbone.View.extend({

    el: '#wellcome',

    template: Handlebars.compile(tpl),

    events: function() {
      if (window.ontouchstart) {
        return  {
          'touchstart .btn-close-modal': 'close',
          'touchstart .modal-background': 'close'
        };
      }
      return {
        'click .btn-close-modal': 'close',
        'click .modal-background': 'close'
      };
    },

    initialize: function() {
      this.$body = $('body');
      this.$html = $('html');

      this.render();

      $(document).keyup(_.bind(this.onKeyUp, this));
    },

    render: function() {
      // Render modal base
      this.$el.html(this.template());
    },

    onKeyUp: function(e) {
      e.stopPropagation();
      // press esc
      if (e.keyCode === 27) {
        this.close();
      }
    },

    close: function() {
      this.remove();
      this.$body.removeClass('has-no-scroll');
    }

  });

  return ModalWindowView;

});
