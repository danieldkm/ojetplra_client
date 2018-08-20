// header module viewModel

'use strict';
define(['ojs/ojbutton'], function() {
  function basicHeaderVM(params) {
    var self = this;
    self.title = params.title || '';
    self.startBtn = params.startBtn;
    self.endBtn = params.endBtn;
    self.endBtn.disabled = params.endBtn.disabled || false;
  }
  return basicHeaderVM;
});
