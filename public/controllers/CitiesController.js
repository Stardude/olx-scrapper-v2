((angular, _) => {
    const app = angular.module("app");

    app.controller("CitiesController", function ($scope, $http) {
        $scope.data = {
            cities: [],
            addDisabled: false,
            sortColumns: [],
            sortDirections: []
        };

        function sortCities(cities) {
            return _.orderBy(cities, $scope.data.sortColumns, $scope.data.sortDirections);
        }

        $http.get(`/api/cities`)
            .then(response => {
                $scope.data.cities = response.data.cities || [];
                $scope.data.cities.forEach(city => {
                    city.original = { ...city };
                    city.checked = false;
                    city.dateOfChecking = city.dateOfChecking || "";
                    city.expanded = false;
                    city.topGeneralPercentage = (city.generalAmount && city.topAmount) ?
                        (parseInt(city.topAmount || 0) / parseInt(city.generalAmount || 0) * 100).toFixed(2)
                        : "";
                });
                $scope.data.sortColumns.push("dateOfChecking");
                $scope.data.sortDirections.push("desc");
                $scope.data.cities = sortCities($scope.data.cities);
            });

        $scope.getSortIcon = function (column) {
            const foundIndex = $scope.data.sortColumns.findIndex(c => c === column);
            if (foundIndex !== -1) {
                const order = $scope.data.sortDirections[foundIndex];
                return order === "asc" ? "⇧" : "⇩";
            }
            return "⇳";
        };

        $scope.sortBy = function (column) {
            const foundIndex = $scope.data.sortColumns.findIndex(c => c === column);
            if (foundIndex !== -1) {
                const order = $scope.data.sortDirections[foundIndex];
                if (order === "desc") {
                    $scope.data.sortDirections[foundIndex] = "asc";
                } else {
                    $scope.data.sortColumns.splice(foundIndex, 1);
                    $scope.data.sortDirections.splice(foundIndex, 1);
                }
            } else {
                $scope.data.sortColumns.push(column);
                $scope.data.sortDirections.push("desc");
            }

            $scope.data.cities = sortCities($scope.data.cities);
        };

        function prepareForRequest(cities) {
            return cities.map(city => {
                delete city.original;
                delete city.isEdit;
                delete city.isNew;
                delete city.checked;
                delete city.expanded;
                return city;
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

        $scope.addCity = function () {
            if ($scope.data.addDisabled) {
                return;
            }

            $scope.data.cities.push({
                olxId: "",
                name: "",
                isNew: true
            });
            $scope.data.addDisabled = true;
        };

        $scope.editCity = function (city) {
            city.isEdit = true;
            $scope.data.addDisabled = true;
        };

        $scope.deleteCity = function (city) {
            $http.delete(`/api/cities/${city.id}`)
                .then(() => {
                    $scope.data.cities = $scope.data.cities.filter(c => c.id !== city.id);
                });
        };

        $scope.saveCity = function (city) {
            if (city.isNew) {
                $http.post(`/api/cities/`, prepareForRequest([city])[0])
                    .then(response => {
                        const index = $scope.data.cities.findIndex(c => c.olxId === city.olxId);
                        const updatedCity = response.data;
                        $scope.data.cities.splice(index, 1, updatedCity);
                        $scope.data.addDisabled = false;
                    });
            } else if (city.isEdit) {
                $http.put(`/api/cities/${city.id}`, prepareForRequest([city])[0])
                    .then(response => {
                        city.isEdit = false;
                        city.olxId = response.data.olxId;
                        city.name = response.data.name;
                        $scope.data.addDisabled = false;
                    });
            }
        };

        $scope.cancelCity = function (city) {
            if (city.isNew) {
                $scope.data.cities = $scope.data.cities.filter(c => !c.isNew);
                $scope.data.addDisabled = false;
                delete city.isNew;
            } else if (city.isEdit) {
                city.olxId = city.original.olxId;
                city.name = city.original.name;
                delete city.isEdit;
                $scope.data.addDisabled = false;
            }
        };

        $scope.toggleCheckboxes = function (checked) {
            $scope.data.cities.forEach(city => {
                city.checked = checked;
            });
        };

        $scope.collectStatistics = async () => {
            if ($scope.data.cities.some(c => c.isEdit || c.isNew)) {
                return;
            }

            const cityIds = $scope.data.cities.filter(c => c.checked).map(c => c.id);

            if (!cityIds.length) {
                return;
            }

            $http.post(
                `/api/cities/statistics`,
                { cityIds, writeToExcel: false }
            ).then(() => {
                $scope.toggleCheckboxes(false);
            });
        };

        $scope.storeToExcel = async () => {
            if ($scope.data.cities.some(r => r.isEdit || r.isNew)) {
                return;
            }

            const cityIds = $scope.data.cities.filter(c => c.checked).map(c => c.id);

            if (!cityIds.length) {
                return;
            }

            $http.post(
                `/api/cities/statistics`,
                { cityIds, writeToExcel: true, getFromDb: true }
            ).then(() => {
                $scope.toggleCheckboxes(false);
            });
        };

        $scope.collectAndStore = async () => {
            if ($scope.data.cities.some(r => r.isEdit || r.isNew)) {
                return;
            }

            const cityIds = $scope.data.cities.filter(c => c.checked).map(c => c.id);

            if (!cityIds.length) {
                return;
            }

            $http.post(
                `/api/cities/statistics`,
                { cityIds, writeToExcel: true }
            ).then(() => {
                $scope.toggleCheckboxes(false);
            });
        };
    });
})(window.angular, window._);