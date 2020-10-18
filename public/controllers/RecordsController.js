((angular) => {
    const app = angular.module("app");

    app.controller("RecordsController", function ($scope, $http, $stateParams) {
        $scope.data = {
            categoryId: $stateParams.categoryId,
            records: [],
            addDisabled: false
        };

        $http.get(`/api/categories/${$scope.data.categoryId}/records`)
            .then(response => {
                $scope.data.records = response.data.records || [];
                $scope.data.records.forEach(record => {
                    record.original = { ...record };
                    record.checked = false;
                });
            });

        function prepareForRequest(records) {
            return records.map(record => {
                delete record.original;
                delete record.isEdit;
                delete record.isNew;
                delete record.checked;
                record.categoryId = $scope.data.categoryId;
                return record;
            });
        }

        $scope.formatDate = function (date) {
            const dateObj = new Date(date);
            const year = "" + dateObj.getFullYear();
            const month = dateObj.getMonth();
            const day = dateObj.getDate();
            const hours = dateObj.getHours();
            const minutes = dateObj.getMinutes();
            const seconds = dateObj.getSeconds();
            return `${day}.${month + 1}.${year.slice(2)}/${hours}:${minutes}:${seconds}`;
        };

        $scope.addRecord = function () {
            if ($scope.data.addDisabled) {
                return;
            }

            $scope.data.records.push({
                olxId: "",
                name: "",
                isNew: true
            });
            $scope.data.addDisabled = true;
        };

        $scope.editRecord = function (record) {
            record.isEdit = true;
            $scope.data.addDisabled = true;
        };

        $scope.deleteRecord = function (record) {
            $http.delete(`/api/categories/${$scope.data.categoryId}/records/${record.id}`)
                .then(() => {
                    $scope.data.records = $scope.data.records.filter(r => r.id !== record.id);
                });
        };

        $scope.saveRecord = function (record) {
            if (record.isNew) {
                $http.post(`/api/categories/${$scope.data.categoryId}/records`, prepareForRequest([record])[0])
                    .then(response => {
                        const index = $scope.data.records.findIndex(r => r.olxId === record.olxId);
                        const updatedRecord = response.data;
                        $scope.data.records.splice(index, 1, updatedRecord);
                        $scope.data.addDisabled = false;
                    });
            } else if (record.isEdit) {
                $http.put(`/api/categories/${$scope.data.categoryId}/records/${record.id}`, prepareForRequest([record])[0])
                    .then(response => {
                        record.isEdit = false;
                        record.olxId = response.data.olxId;
                        record.name = response.data.name;
                        $scope.data.addDisabled = false;
                    });
            }
        };

        $scope.cancelRecord = function (record) {
            if (record.isNew) {
                $scope.data.records = $scope.data.records.filter(r => !r.isNew);
                $scope.data.addDisabled = false;
                delete record.isNew;
            } else if (record.isEdit) {
                record.olxId = record.original.olxId;
                record.name = record.original.name;
                delete record.isEdit;
                $scope.data.addDisabled = false;
            }
        };

        $scope.toggleCheckboxes = function (checked) {
            $scope.data.records.forEach(record => {
                record.checked = checked;
            });
        };

        $scope.changePrice = async (type) => {
            if ($scope.data.records.some(r => r.isEdit || r.isNew)) {
                return;
            }

            const el = document.getElementById(`price-${type}`);
            const value = el.value;
            const recordIds = $scope.data.records.filter(r => r.checked).map(r => r.id);

            if (!recordIds.length) {
                return;
            }

            $http.post(
                `/api/categories/${$scope.data.categoryId}/changePrice`,
                { recordIds, priceData: { type, value } }
                ).then(() => {
                    el.value = 0;
                });
        };
    });
})(window.angular);