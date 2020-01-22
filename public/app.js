((angular) => {
   const app = angular.module('app', []);

   app.controller('MainCtrl', async ($scope, $http) => {
       $scope.data = {
           btnsDisabled: false
       };

       function adjustAdvs (advs) {
           Object.keys(advs).forEach(cat => {
               let index = 0;
               advs[cat] = advs[cat].map(i => ({...i, index: index++}));
           });
       }

       function markProblematicAdvs (problematicAdvs, category) {
           $scope.data.advs[category] = $scope.data.advs[category].map(i => {
               if (problematicAdvs.includes(i.id)) {
                   return {...i, problematic: true};
               } else {
                   return i;
               }
           });
       }

       $http.get('/categories').then(res => {
           $scope.data.advs = res.data;
           adjustAdvs($scope.data.advs);
       });

       $scope.changePrice = (category, type, offsetParam) => {
           const el = document.getElementById(`${category}_${type}`);
           const value = el.value;
           let offset = offsetParam || 0;
           $scope.data.btnsDisabled = true;
           $http.post('/changePrice', { value, type, category, offset }, { timeout: 60000 * 60 * 24 }).then(res => {
               const {problematicAdvs, newOffset} = res.data;
               markProblematicAdvs(problematicAdvs, category);
               if (newOffset) {
                   $scope.changePrice(category, type, newOffset);
                   return;
               }
               $scope.data.btnsDisabled = false;
               el.value = 0;
           });
       };

       $scope.addItem = category => {
           const list = $scope.data.advs[category];
           const l = list.length - 1;
           let lastIndex = l >= 0 ? list[l].index + 1 : 0;
           list.push({id: null, name: '', new: true, index: lastIndex++});
       };

       function postList (category, list) {
           $http.post(`/categories/${category}`, list).then(res => {
               $scope.data.advs[category] = res.data;
               adjustAdvs($scope.data.advs);
           });
       }

       $scope.update = category => {
           const list = $scope.data.advs[category];
           for (let i = 0; i < list.length; i++) {
               const item = list[i];
               if (!item.id || !item.name) {
                   return;
               }
           }
           postList(category, list);
       };

       $scope.updateDisabled = category => {
           const l = $scope.data.advs[category].length;
           return l === 0 || $scope.data.advs[category][l - 1].new !== true;
       };

       $scope.removeItem = (category, index) => {
           let list = $scope.data.advs[category];
           let isNew = list.find(i => i.index === index).new === true;
           $scope.data.advs[category] = list.filter(i => i.index !== index);
           !isNew && postList(category, $scope.data.advs[category]);
       };

       $scope.fetchStatistics = () => {
           $http.get('/statistics');
       };
   });
})(window.angular);