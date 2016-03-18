'use strict';

/**
 * @ngdoc function
 * @name nordtestApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the nordtestApp
 */
angular.module('nordtestApp')
  .controller('MainCtrl', function ($scope, localStorageService, $uibModal) {

      //Variable for managing validation alerts

      //Create fake DB and fill with some data.
      //Restore data if exist in local storage
      var personsInStore = localStorageService.get('persons');

      $scope.persons = personsInStore || [
              {
                  id: "emp1",
                  name: "John Doe",
                  gender: "Male",
                  age: 32
              },{
                  id: "emp2",
                  name: "Diana Barry",
                  gender: "Female",
                  age: 28
              },{
                  id: "emp3",
                  name: "Bruce Wayne",
                  gender: "Male",
                  age: 46
              },{
                  id: "emp4",
                  name: "Jane Porter",
                  gender: "Female",
                  age: 19
              }
          ];

      //Variable for storing next ID to make it unique
      var empId = ($scope.persons.length + 1);

      $scope.$watch('persons', function () {
          localStorageService.set('persons', $scope.persons);
          $scope.filteredPersons = $scope.persons;
      }, true);

      //Add new person with next available ID
      $scope.addPerson = function(){
          this.person.id = "emp" + empId;
          $scope.persons.push($scope.person);
          //Empty scope variable and add 1 to next ID
          $scope.person = {};
          $scope.createPerson.$setPristine();
          empId++;
      }

      //Update person

      $scope.updatePerson = {};

      //Default: set for all entries ng-hide/show to false. Just basic row now
      for (var i = 0, length = $scope.persons.length; i < length; i++) {
          $scope.updatePerson[$scope.persons[i].id] = false;
      }
      //Show input control in current row for update
      $scope.modify = function(persons){
          $scope.updatePerson[persons.id] = true;
      };
      //Update person and replace input back to normal row
      $scope.update = function(persons){
          $scope.updatePerson[persons.id] = false;
      };

      $scope.delete = function (person){
          $scope.person = person;
      }
      //Sorting
      $scope.predicate = 'index';
      $scope.reverse = true;
      $scope.order = function(predicate) {
          $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
          $scope.predicate = predicate;
      };

      //Pagination settings
      $scope.perPerPage = 5;
      $scope.currentPage = 1;
      $scope.maxSize = 5;

      //dynamically update table when new person added/deleted
      $scope.$watch("currentPage + perPerPage + persons", function() {
          var begin = (($scope.currentPage - 1) * $scope.perPerPage)
              , end = begin + $scope.perPerPage;
          $scope.filteredPersons = $scope.persons.slice(begin, end);
      });

      //Modal confirmation
      $scope.open = function (person) {

          var ModalInstance = $uibModal.open({
              templateUrl: 'myModalContent.html',
              controller: ModalInstanceCtrl,
              resolve: {
                  personIndex: function () {
                      return $scope.persons.indexOf(person) //get an index of person to delete
                  },
                  persons: function () {
                      return $scope.persons
                  }
              }
          });

          ModalInstance.result.then(function (selectedCustomer) {
              $scope.selected = selectedCustomer;
          }, function () {

          });
      };
  });

//Modal controller
var ModalInstanceCtrl = function ($scope, $uibModalInstance, persons, personIndex) {

    $scope.persons = persons;
    $scope.selected = {
        person: $scope.persons[personIndex]
    };

    var removePerson = function(index){
        $scope.persons.splice(index, 1);
    }
    $scope.ok = function () {
        //Remove person with specific index
        removePerson(personIndex);
        $uibModalInstance.close($scope.selected.persons);
    };
    //Close modal window
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    }
}