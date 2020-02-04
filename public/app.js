((angular) => {
   const app = angular.module('app', []);

   app.controller('MainCtrl', async ($scope, $http) => {
       $scope.data = {
           btnsDisabled: false,
           checked: {}
       };

       function adjustAdvs (advs) {
           Object.keys(advs).forEach(cat => {
               let index = 0;
               advs[cat] = advs[cat].map(i => ({...i, index: index++, checked: false}));
               $scope.data.checked[cat] = false;
           });
       }

       function markAdvs (successfulAdvs, problematicAdvs, category) {
           $scope.data.advs[category] = $scope.data.advs[category].map(i => {
               if (problematicAdvs.includes(i.id)) {
                   return {...i, problematic: true};
               } else if (successfulAdvs.includes(i.id)) {
                   return {...i, successful: true};
               } else {
                   return i;
               }
           });

           $scope.$apply();
       }

       $http.get('/categories').then(res => {
           $scope.data.advs = res.data;
           adjustAdvs($scope.data.advs);
       });

       $scope.changePrice = async (category, type) => {
           const el = document.getElementById(`${category}_${type}`);
           const value = el.value;
           const filteredAdvs = $scope.data.advs[category].filter(adv => adv.checked);
           $scope.data.btnsDisabled = true;

           let offset = 0,
               advs = [],
               batchSize = filteredAdvs.length,
               i = 0;

           while (i < filteredAdvs.length) {
               advs = filteredAdvs.slice(offset, batchSize);
               const res = await $http.post('/changePrice', { value, type, advs }, { timeout: 60000 * 60 * 24 });
               const {successfulAdvs, problematicAdvs} = res.data;
               markAdvs(successfulAdvs, problematicAdvs, category);
               const newOffset = res.data.offset;

               if (!newOffset || i + newOffset === filteredAdvs.length) {
                   await $http.post('/close', {});
                   break;
               }

               offset += newOffset;
               i = offset;
           }

           $scope.data.btnsDisabled = false;
           el.value = 0;
           i !== 0 && $scope.$apply();
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

       $scope.toggleCheckboxes = category => {
           const list = $scope.data.advs[category];
           list.forEach(item => {
               item.checked = !$scope.data.checked[category];
           });
           $scope.data.checked[category] = !$scope.data.checked[category];
       };
   });
})(window.angular);