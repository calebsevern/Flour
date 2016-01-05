
(function() {
  
  angular.module('project', [])

  .run(function($rootScope, DataFactory) {
    $rootScope.DataFactory = DataFactory;
    DataFactory.loadData();
    DataFactory.loadTypes();
  })
  
  .service('DataFactory', function($rootScope, $http) {
    var data = {
      view: 'data',
      currentType: 'counts',
      attributes: [],
      rows: [],
      types: []
    };
    
    function sortObj(obj) {
      var sorted = [];
      Object.keys(obj).sort().forEach(function(v, i) {
        sorted.push(obj[v]);
      });
      return sorted;
    }
    
    return {
      loadTypes: function() {
        Flour.objects(function(results) {
          data.types = results;
        });
      },
      loadAttributes: function() {
        var query = new Query(data.currentType);
        query.attributes(function(results) {
          data.attributes = results;
        });
      },
      loadData: function() {
        var query = new Query(data.currentType);
        query.find(function(results) {
          data.rows = [];
          data.attributes = [];
          
          // If there are no results to look at, manually fetch object attributes
          if(results.length > 0)
            Object.keys(results[0]).sort().forEach(function(v, i) {
              data.attributes.push(v);
            });
          else $rootScope.DataFactory.loadAttributes();
          
          for(var i = 0; i < results.length; i++) {
            data.rows.push(sortObj(results[i]));
          }
          
          $rootScope.$apply();
        });
      },
      addRow: function(cb) {
        var query = new Query(data.currentType);
        query.create(function(obj) {
          $rootScope.DataFactory.loadData();
          if(cb) cb();
        });
      },
      removeRow: function(cb)  {
        
        var query = new Query(data.currentType);
        query.get(data.rows.pop()[data.attributes.indexOf('objectId')], function(result) {
          result.destroy(function() {
            if(cb) cb();
          });
        });
      },
      data: data
    };
  })
  
  .controller('DataController', function($scope, DataFactory) {
    $scope.DataFactory = DataFactory;
    
    this.addRow = function() {
      DataFactory.addRow();
    };
    
    this.removeRow = function() {
      DataFactory.removeRow();
    };
    
    this.addColumn = function() {
      
    };
    
    this.deleteType = function() {
      var entry = prompt('Enter the object name below to confirm:');
      if(entry === DataFactory.data.currentType) {
        window.location.reload();
      } else alert('Action cancelled.');
    };
  })
  
  .controller('NavController', function($scope, DataFactory) {
    $scope.DataFactory = DataFactory;
    
    this.generalView = function() {
      DataFactory.data.view = 'general';
      DataFactory.data.rows = [];
      DataFactory.data.currentType = '';
    }
    
    this.dataView = function(type) {
      DataFactory.data.view = 'data';
      DataFactory.data.currentType = type;
      DataFactory.loadData();
    }
  });
  
})();














