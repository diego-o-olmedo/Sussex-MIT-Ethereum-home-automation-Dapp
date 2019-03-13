
describe('testing the home automation app', function () {
    /** injecting the Angular mode before every test case */
  beforeEach(module('eth-sussex-iot'));

  /* testing the home controller code */
  describe('testing home controller', function () {
    var scope, ctrl;

    beforeEach(inject(function ($scontroller, $rootScope) {
      scope = $rootScope.$new();
      ctrl = $controller('homeController', {
        $scope: scope
      });
    }));

    /* test case: at the start of the app, connections array should only have the two test connections I provided */
    it('should initialise the connections array', function () {
      expect(scope.connections.length).toBe(2);
    })
    


  });


});
