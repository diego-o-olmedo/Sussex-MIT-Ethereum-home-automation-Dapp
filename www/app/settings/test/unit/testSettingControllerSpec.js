describe('testing the home automation app', function () {
    /** injecting the Angular mode before every test case */
  beforeEach(module('eth-sussex-iot'));

  /* testing the add connection controller code */
  describe('testing settings controller', function () {
    var scope, ctrl;

    beforeEach(inject(function ($scontroller, $rootScope) {
      scope = $rootScope.$new();
      ctrl = $controller('homeController', {
        $scope: scope
      });
    }));

    /* test case: at the start of the app, the connection name should be an empty string */
    it('should initialise the connection object', function () {
      expect(scope.connection.name).toBe('');
    })
    


  });


});