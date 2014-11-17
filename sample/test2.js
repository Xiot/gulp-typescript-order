var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="test1.ts" />
var ts;
(function (ts) {
    var Test2 = (function (_super) {
        __extends(Test2, _super);
        function Test2() {
            _super.apply(this, arguments);
        }
        return Test2;
    })(ts.Test1);
    ts.Test2 = Test2;
})(ts || (ts = {}));
//# sourceMappingURL=test2.js.map
