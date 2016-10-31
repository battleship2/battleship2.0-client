function describeLogic(name, testsDescription) {
    _describeComponent(name, null, testsDescription);
}

function describeLogicPoint(name, testsDescription) {
    _describeComponent(name, null, testsDescription, '    ');
}


function _describeComponent(name, type, testsDescription, prefix) {
    describe(name, function () {
        _logTestStart(name, type, prefix);
        testsDescription();
    });
}
function _logTestStart(name, type, prefix) {
    beforeAll(function () {
        console.log((prefix || '') + '>> ' + name + (type ? ' ' + type : ''));
    });
}
