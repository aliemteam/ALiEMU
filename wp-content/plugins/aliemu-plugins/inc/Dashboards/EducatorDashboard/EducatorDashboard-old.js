var $ = jQuery;
/**
 * Main Educator Dashboard Module
 * @module EducatorDashboard
 * @class Components
 * @version 0.0.1
 * @since 1.0.0
 */
var EducatorDashboard;
(function (EducatorDashboard) {
    /**
     * Class containing DOM components / generators
     * @class EducatorDashboard#Components
     * @version 0.1.1
     * @since 1.0.1
     */
    var Components = (function () {
        function Components() {
            /**
             * Instantiates event handler for the course category select box.
             *
             * @since 0.1.1
             * @return {void}
             */
            this.categorySelectHandler = function () {
                $('#category-selection').change(function (e) {
                    $('#course-selection > option:gt(0)').remove();
                    $('#course-selection').trigger('change');
                    if (e.target.value === '0') {
                        $('#course-selection').attr('disabled', true);
                        return;
                    }
                    var courseIDs = e.target.value.split('_');
                    _.eachRight(courseIDs, function (courseID) {
                        $('#course-selection').append("<option value=\"" + courseID + "\">" + payload.courseData.courses[courseID].post_title + "</option>");
                    });
                    $('#course-selection').attr('disabled', false);
                });
            };
            this.categorySelectHandler();
        }
        /**
         * Generates a CSV export button for a given user.
         *
         * @since 0.1.1
         * @method EducatorDashboard#Components#userExportBtn
         * @param {string} userID The user's ID.
         * @returns {HTMLDivElement} A formatted div export button
         */
        Components.userExportBtn = function (userID) {
            return ('<div class="au-edudash-exportbtn" id="export-user-data-' + userID + '">' +
                '<a href="#">Export Data</a>' +
                '</div>');
        };
        /**
         * Generates a series of table rows for a table containing a list of users.
         *
         * @since 0.1.0
         * @method EducatorDashboard#Components.tableRow
         * @param {any[]} userArr An array of user objects.
         * @param {any[]} params An array containing a list of properties (type = `string`)
         *   **OR** an array containing a helper method that uses a given user's ID as
         *   the **first** argument, in the form of `[functionName, ['secondArgument',
         *   'thirdArgument']]`.
         * @param {bool} [hidden=true] If you want all of the rows to be immediately
         *   visible, make this `false`. Otherwise, keep `true`. (usually other functions
         *   will be in charge of showing the row, so more often than not, you'll want to
         *   keep this `true`).
         * @returns {string} A formatted HTML string of one or more table rows.
         * @example
         * Components.tableRow(userArray, ['display_name', [users.courseCompletionDate, [courseID]] ]);
         * // returns <tr style="display: none;"><td>Chris Gaafary</td><td>4/23/2015</td></tr> ...
         */
        Components.tableRow = function (userArr, params, hidden) {
            if (hidden === void 0) { hidden = true; }
            var allRows = '';
            _.each(userArr, function (user) {
                var currentRow = "<tr userID=\"" + user.ID + "\"" + (hidden ? ' style="display: none;"' : '') + ">";
                _.each(params, function (param) {
                    currentRow += "<td" + (param.centered ? ' style="text-align: center;"' : '') + ">";
                    switch (typeof param.param) {
                        case 'string':
                            currentRow += (user[param.param] || 'Unspecified') + "</td>";
                            break;
                        case 'function':
                            if (param.args !== undefined) {
                                currentRow += param.param.apply(param, [user.ID].concat(param.args)) + "</td>";
                                return;
                            }
                            currentRow += param.param(user.ID) + "</td>";
                            break;
                    }
                });
                currentRow += '</tr>';
                allRows += currentRow;
            });
            return allRows;
        };
        return Components;
    }());
    EducatorDashboard.Components = Components;
    /**
     * Class containing commonly executed helper methods
     * @class Utils
     * @version 0.0.2
     * @since 1.0.0
     */
    var Utils = (function () {
        function Utils() {
            var _this = this;
            /**
             * Contains methods useful in determining the type of browser
             * browser the current user is running.
             * @namespace Utils#browserCheck
             */
            this.browserCheck = {
                /** @method Utils#browserCheck#isFirefox */
                isFirefox: function () { return typeof InstallTrigger !== 'undefined'; },
                /** @method Utils#browserCheck#isChrome */
                isChrome: function () { return !!window.chrome && !(!!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0); },
                /** @method Utils#browserCheck#isIE */
                isIE: function () { return false || !!document.documentMode; }
            };
            /**
             * Responsible for table pagination.
             *
             * @since 0.0.2
             * @method Utils#paginate
             *
             * @param {string} tableID - The HTML ID of the desired table for pagination (without '#')
             */
            this.paginate = function (tableID) {
                var table = "#" + tableID, rows = "#" + tableID + ">tbody>tr", pager = "#" + tableID + "-pager", maxRows = _this.rowSelect.getValue(), totalRows = $(rows).not('.filtered-row').length, currentPage = parseInt($(pager).children('.active').text()) || 1, startNumber = (currentPage - 1) * maxRows, endNumber = startNumber + maxRows;
                if ($(table).siblings('.pager').length === 0) {
                    $(table).parent().append("<div class=\"pager\" id=\"" + tableID + "-pager\"></div>");
                }
                else {
                    $(table).siblings('.pager').html('');
                }
                $(rows).hide();
                $(rows)
                    .not('.filtered-row')
                    .slice(startNumber, endNumber)
                    .show();
                $(pager).append(function () {
                    var output = '', numPages = Math.ceil(totalRows / maxRows);
                    for (var i = 1; i <= numPages; i++) {
                        output += "<span class=\"page-number " + (i === currentPage ? 'active' : '') + "\">" + i + "</span>";
                    }
                    return output;
                });
                $(pager).children('.page-number').click(function (event) {
                    $(pager).children('.page-number').removeClass('active');
                    $(event.currentTarget).addClass('active');
                    _this.paginate(tableID);
                });
            };
            /**
             * Polyfill wedge responsible for serving the file based on the current
             *  user's browser.
             * @since 0.0.1
             * @method Utils#downloadPolyfill
             * @param {CSVFile} FileObj - An object (which interfaces the File interface).
             * @param {string} [linkID] - The HTML ID of the anchor tag you would like
             *  to place this file to. If not used, then the file is immediately
             *  downloaded.
             */
            this.downloadPolyfill = function (FileObj, linkID) {
                if (!linkID) {
                    if (_this.browserCheck.isChrome() || _this.browserCheck.isFirefox()) {
                        var url = document.createElement('a');
                        url.setAttribute('href', URL.createObjectURL(FileObj.blob));
                        url.setAttribute('download', FileObj.name);
                        document.body.appendChild(url);
                        url.click();
                        document.body.removeChild(url);
                    }
                    else if (_this.browserCheck.isIE()) {
                        window.navigator.msSaveBlob(FileObj.blob, FileObj.name);
                    }
                    else {
                        alert('Please use Chrome, Firefox, or IE browser. Yours is not supported');
                    }
                    return;
                }
                if (_this.browserCheck.isChrome() || _this.browserCheck.isFirefox()) {
                    $("#" + linkID)
                        .attr("href", window.URL.createObjectURL(FileObj.blob))
                        .attr("download", FileObj.name);
                }
                else if (_this.browserCheck.isIE()) {
                    $("#" + linkID).click(function (e) {
                        e.preventDefault();
                        window.navigator.msSaveBlob(FileObj.blob, FileObj.name);
                    });
                }
                else {
                    $("#" + linkID).click(function (e) {
                        e.preventDefault();
                        alert('Please use Chrome, Firefox, or IE browser. Yours is not supported');
                    });
                }
            };
            /**
             * A holder object for the currently visible rows of all tables.
             * @since 0.0.1
             * @name Utils#visibleRows
             */
            this.visibleRows = {};
            /**
             * Holds the `#num-rows-shown` element and offers a convienient
             *  method for getting the currently selected value
             * @memberof Utils
             * @since 0.0.1
             * @namespace Utils.rowSelect
             * @todo Refactor this to make more modular (currently it only pertains to a single element)
             */
            this.rowSelect = {
                /**
                 * The `num-rows-shown` HTML element in the form of `$('#num-rows-shown')`
                 * @memberof Utils.rowSelect#
                 * @since 0.0.1
                 */
                element: $('#num-rows-shown'),
                /**
                 * Method offering a convienient way of obtaining the currently selected visible rows option.
                 * @memberof Utils.rowSelect#
                 * @since 0.0.1
                 * @method getValue
                 * @return {number} The currently selected value of the `num-rows-shown` select box.
                 */
                getValue: function () {
                    return parseInt($(_this.rowSelect.element).val());
                }
            };
        }
        /**
         * Generates a CSV for either all users (`singleUser = false`) or a single
         *   `singleUser = true`leUser = true)
         *
         * This method was written to be as modular as possible. Thus, the
         *   `data` parameter can accept two very different inputs.
         * @method Utils.generateCSV
         * @since 0.0.1
         * @param {string[]} identifiers - Array of strings containing the user(s)
         *   userID.
         * @param {string} headings - A comma-separated string of heading names
         *   desired for the CSV output. **Note:** Do not put spaces
         *   between commas (eg: `'Heading One,Heading Two'`).
         * @param {any[]} data - Depends on the `singleUser` parameter:
         * #### **Case 1:** `singleUser = false`
         * - If you are interested in getting a variable within the `Users.data`
         * object, then use the variable's keyname as a string.
         * (eg: `'display_name'`).
         * - If you are interested in using a method to gather data **whos only required
         * parameter** is the `UserID`, then insert the function name
         * (no quotes, no parens). (eg: `users.coursesCompleted`).
         * - If you are interested in using a method to gather data which requires
         * multiple parameters **including** the `userID`
         * as the **first parameter**, then insert an array in the form
         * of `[functionName, ['parameter2', 'parameter3', ...]]`
         *
         * #### **Case 2:** `singleUser =true`
         * - Insert an array containing a single, preparsed CSV string.
         * @param {string} filename - The desired filename (not including
         *  `.CSV`).
         * @param {boolean} [singleUser=false] - Is this for a single
         *  user?
         * @return {CSVFile} A File interface containing the CSV blob and Filename.
         *
         * @example
         * // Case: singleUser = false
         * // assume courseID is has already been defined
         * let userIDs = ['12', '135', '23'] // Array of user IDs
         * let headings = ['First Name,Last Name,Completed Courses,Date Completed'];
         * let data = ['first_name', 'last_name', coursesCompleted, [users.courseCompletionDate, [courseID]]];
         *
         * Utils.generateCSV(userIDs, headings, data, 'my_csv');
         * // Returns CSV glob with the filename my_csv.csv
         */
        Utils.generateCSV = function (identifiers, headings, data, filename, singleUser) {
            if (singleUser === void 0) { singleUser = false; }
            var output = [(headings + "\n")], row, blob;
            if (singleUser) {
                output.push(data[0]);
            }
            else {
                _.each(identifiers, function (userID, index) {
                    row = [];
                    data.forEach(function (option) {
                        switch (typeof option) {
                            case 'string':
                                row.push(Users.data[userID][option] || '');
                                break;
                            case 'object':
                                row.push(option[0].apply(option, [userID].concat(option[1])));
                                break;
                            case 'function':
                                row.push(option(userID));
                                break;
                        }
                    });
                    row.forEach(function (item) {
                        if (typeof item === 'object' && item[0].search(/,/) !== -1) {
                            item[0] = "\"" + item[0] + "\"";
                        }
                    });
                    row = row.join(',') + "\n";
                    output.push(row);
                });
            }
            output = output.join('');
            blob = new Blob([output], {
                type: "text/csv;charset=utf-8"
            });
            return {
                name: filename + ".csv",
                blob: blob
            };
        };
        return Utils;
    }());
    EducatorDashboard.Utils = Utils;
    /**
     * Class representing all Users.
     *
     * @class Users
     * @version 0.0.1
     * @since 1.0.0
     */
    var Users = (function () {
        function Users() {
            /**
             * Calculates the total hours that a given user has accrued, or the adjusted total
             * 	hours based on the presence of the second parameter.
             *
             * @since 1.0.3
             * @version 0.0.2
             * @method Users#calculateHours
             *
             * @param {string} userID - The user's ID.
             * @param {Object} [dateRange] - An Object in the form of {fromDate: {Date}, toDate: {Date}}
             * @return {number} The number of hours accrued by the current user.
             *
             * @example
             * Users.calculateHours('1');
             * // returns number of III hours for Chris Gaafary
             */
            this.calculateHours = function (userID, dateRange) {
                var progress = Users.data[userID]['_sfwd-course_progress'], completed = [], totalHrs = 0;
                _.each(progress, function (value, key) {
                    if (parseInt(value.completed) === parseInt(value.total)) {
                        completed.push(key);
                    }
                });
                if (dateRange) {
                    var completionDates = completed.map(function (courseID) {
                        return { ID: courseID, date: new Date(Users.data[userID][("course_completed_" + courseID)][0] * 1000) };
                    });
                    completed = [];
                    _.each(completionDates, function (completionDate, index) {
                        if (dateRange.fromDate < completionDate.date && completionDate.date < dateRange.toDate) {
                            completed.push(completionDate.ID);
                        }
                    });
                }
                _.each(completed, function (courseID) {
                    totalHrs += parseInt(payload.courseData.courseMeta[courseID]['_au-meta']['au-recommended_hours']);
                });
                return totalHrs;
            };
            /**
             * Calculates the number of courses completed for a given user.
             *
             * @since 0.0.1
             * @method Users#coursesCompleted
             *
             * @param {string} userID - The user's ID.
             * @return {number} The number of completed courses.
             *
             * @example
             * Users.coursesCompleted('1');
             * // returns number of completed courses for Chris Gaafary
             */
            this.coursesCompleted = function (userID, dateRange) {
                var progress = Users.data[userID]['_sfwd-course_progress'], completed = 0, courseIDs = [];
                _.each(progress, function (value, key) {
                    if (parseInt(value.completed) === parseInt(value.total)) {
                        completed++;
                        courseIDs.push(key);
                    }
                });
                if (dateRange) {
                    completed = 0;
                    var completionDates = courseIDs.map(function (courseID) {
                        return new Date(Users.data[userID][("course_completed_" + courseID)][0] * 1000);
                    });
                    completionDates = completionDates.filter(function (completionDate) {
                        return dateRange.fromDate < completionDate && completionDate < dateRange.toDate;
                    });
                    return completionDates.length;
                }
                return completed;
            };
            /**
             * Calculates the number of courses in progress for a given user.
             *
             * @since 0.0.1
             * @method Users#coursesInProgress
             *
             * @param {string} userID - The user's ID.
             * @return {number} The number of courses in progress.
             *
             * @example
             * Users.coursesInProgress('1');
             * // returns number of courses still in progress for Chris Gaafary
             */
            this.coursesInProgress = function (userID) {
                var progress = Users.data[userID]['_sfwd-course_progress'], inProgress = 0;
                _.each(progress, function (value) {
                    if (parseInt(value.inProgress) !== parseInt(value.total)) {
                        inProgress++;
                    }
                });
                return inProgress;
            };
            /**
             * Looks up the course completion date for a given user.
             *
             * @since 0.0.1
             * @method Users#courseCompletionDate
             *
             * @param {string} userID - The user's ID.
             * @param {string} courseID - The course ID.
             * @return {string} A date string in the user's locale format.
             *
             * @example
             * Users.courseCompletionDate('1', '408');
             * // returns 4/23/2015
             */
            this.courseCompletionDate = function (userID, courseID) {
                if (typeof Users.data[userID][("course_completed_" + courseID)] !== 'undefined') {
                    return new Date(parseInt(Users.data[userID][("course_completed_" + courseID)]) * 1000).toLocaleDateString();
                }
                else {
                    return 'X';
                }
            };
            /**
             * Checks to see if a lessons is complete for a given user.
             *
             * @since 0.0.1
             * @method Users#checkLessonCompletion
             *
             * @param {string} userID - The user's ID.
             * @param {string} courseID - The main course ID.
             * @param {string[]} lessonID - Array of lesson IDs.
             * @return {string} If the lesson is complete, then "Completed,". Otherwise "X," (Note the comma)
             *
             * @example
             * Users.checkLessonCompletion('1', '408', ['410', '411', '412']);
             * // returns 'Completed,Completed,Completed'
             */
            this.checkLessonCompletion = function (userID, courseID, lessonID) {
                var completionString = '';
                _.each(lessonID, function (ID) {
                    if (Users.data[userID]['_sfwd-course_progress'] !== undefined &&
                        Users.data[userID]['_sfwd-course_progress'][courseID] !== undefined &&
                        Users.data[userID]['_sfwd-course_progress'][courseID].lessons[ID] !== undefined) {
                        completionString += 'Completed,';
                    }
                    else {
                        completionString += 'X,';
                    }
                });
                return completionString;
            };
            var keyName;
            _.each(payload.userData.users, function (user, key) {
                payload.userData.users[key] = user.data;
                for (keyName in payload.userData.userMeta[key]) {
                    payload.userData.users[key][keyName] = payload.userData.userMeta[key][keyName];
                }
                for (keyName in payload.userData.courseProgress[key]) {
                    payload.userData.users[key]['_sfwd-course_progress'] = payload.userData.courseProgress[key];
                }
            });
            /**
             * All users within the current educator's institution. Contains all
             *  user data and user metadata from WordPress.
             * @name Users.data
             * @type {Object}
             */
            Users.data = payload.userData.users;
            /**
             * An ordered array containing all available user IDs.
             * @name Users.IDs
             * @type {string[]}
             */
            Users.IDs = _.keys(payload.userData.users);
            /**
             * The global export CSV Object
             * @name Users.exportAllData
             * @type {CSVFile}
             */
            Users.exportAllData = Utils.generateCSV(Users.IDs, 'Last Name,First Name,Class of,Total III Hours Awarded,Courses In Progress,Courses Completed', ['last_name', 'first_name', 'au_graduation_year', this.calculateHours,
                this.coursesInProgress, this.coursesCompleted], "ALiEMU_Program_Export_" + new Date(Date.now()).toLocaleDateString().replace(/\//g, '-'));
        }
        return Users;
    }());
    EducatorDashboard.Users = Users;
    /**
     * Class which contains course-related properties and methods.
     * @class Courses
     * @version 0.0.1
     * @since 1.0.0
     */
    var Courses = (function () {
        function Courses() {
            /**
             * Holder Object for all the course data from WordPress
             * @name Courses.data
             * @type {object}
             */
            Courses.data = _.object(_.keys(payload.courseData.courses), _.values(payload.courseData.courses));
            /**
             * Holder Object for all the course metadata from WordPress
             * @name Courses.meta
             * @type {object}
             */
            Courses.meta = payload.courseData.courseMeta;
            /**
             * Holder Object for all the lesson data from WordPress
             * @name Courses.lessons
             * @type {object}
             */
            Courses.lessons = payload.courseData.lessons;
            /**
             * Holder Object each of the courses categories, indexed by course ID.
             * @name Courses.data
             * @type {Object}
             */
            Courses.categories = payload.courseData.categories;
        }
        return Courses;
    }());
    EducatorDashboard.Courses = Courses;
})(EducatorDashboard || (EducatorDashboard = {}));
// # Begin DOM Manipulation
var Utils = EducatorDashboard.Utils, Users = EducatorDashboard.Users, Courses = EducatorDashboard.Courses, Components = EducatorDashboard.Components, utils = new EducatorDashboard.Utils(), users = new EducatorDashboard.Users(), courses = new EducatorDashboard.Courses(), components = new EducatorDashboard.Components();
console.log(users);
console.log(courses);
console.log(utils);
/**********************************************************************
 *                        DOM INITIALIZATION                          *
 **********************************************************************/
// # Initialize DOM State
// Apply `Users.exportAllData` glob to the export-all button
utils.downloadPolyfill(Users.exportAllData, 'export-all');
// Generate datepicker objects
$('#filter-from-year').datepicker({
    nextText: '<i class="um-faicon-chevron-circle-right"></i>',
    prevText: '<i class="um-faicon-chevron-circle-left"></i>'
});
$('#filter-to-year').datepicker({
    nextText: '<i class="um-faicon-chevron-circle-right"></i>',
    prevText: '<i class="um-faicon-chevron-circle-left"></i>'
});
// Generate table rows
$('#au-enrolled-students-table>tbody').append(Components.tableRow(_.sortBy(Users.data, 'au_graduation_year').reverse(), [
    { param: 'display_name' },
    { param: 'au_graduation_year' },
    { param: users.calculateHours, centered: true },
    { param: Components.userExportBtn, centered: true }
]));
// Paginate all tables
$(document).find('table').each(function (index, el) {
    utils.paginate(el.id);
});
// # Begin Event Handlers
/*********************************************************************
 *                           CLICK EVENTS                            *
 *********************************************************************/
// ## Click Events
// ### User data export button
$('div[id^="export-user-data-"]').click(function (e) {
    e.preventDefault();
    var userID = /\d+/.exec(e.currentTarget.id)[0], csvBody = '', csvObj;
    if (Users.data[userID]['_sfwd-course_progress'] === undefined) {
        alert('This user has not interacted with any courses.');
        return;
    }
    _.each(Users.data[userID]['_sfwd-course_progress'], function (val, key) {
        csvBody += ("\"" + Courses.data[key].post_title + "\"") + ',' +
            val.completed + ' out of ' + val.total + ',' +
            users.courseCompletionDate(userID, key) + ',' +
            Courses.meta[key]['_au-meta']['au-recommended_hours'] + ',' +
            Courses.categories[key] + ',\n';
    });
    csvObj = EducatorDashboard.Utils.generateCSV([userID], 'Registered Courses,Steps Completed,Date Completed,Associated III Credit Hours,Category', [csvBody], Users.data[userID].display_name, true);
    utils.downloadPolyfill(csvObj);
});
// ### Toggle advanced query button
$('#advanced-filter-toggle').click(function (e) {
    $('#advanced-filter-row').toggle();
    $('#advanced-filter-toggle').children('i').toggleClass('um-faicon-caret-up');
});
// ### Date query button
$('#date-query').click(function (e) {
    var hourHeading = '#au-enrolled-students-table>thead>tr>th:nth-of-type(3)', tableRows = '#au-enrolled-students-table>tbody>tr';
    if ($(e.currentTarget).hasClass('resetbtn')) {
        $(hourHeading).text('Total III Hours');
        $(tableRows).each(function (index, row) {
            var adjustedHours = users.calculateHours($(row).attr('userID')).toString();
            $(row).children('td:nth-of-type(3)').text(adjustedHours);
        });
        $('#filter-to-year, #filter-from-year').attr('disabled', false).val('');
        $(e.currentTarget).toggleClass('resetbtn')
            .css({ 'background': '#34A0DC', 'color': 'white' })
            .val('Query');
        utils.downloadPolyfill(Users.exportAllData, 'export-all');
        return;
    }
    // Disable other queries
    $('#filter-to-year, #filter-from-year').attr('disabled', true);
    // Toggle heading wording
    $(hourHeading).text('Adjusted III Hours');
    // Toggle reset state
    $(e.currentTarget).toggleClass('resetbtn')
        .css({ 'background': 'white', 'color': '#34A0DC' })
        .val('Reset');
    // Begin logic
    // Create a `DateRange` object
    var dateRange = {
        fromDate: new Date($('#filter-from-year').val()),
        toDate: new Date($('#filter-to-year').val()),
    };
    // Apply the adjusted range to each row in the table
    $(tableRows).each(function (index, row) {
        var adjustedHours = users.calculateHours($(row).attr('userID'), dateRange).toString();
        $(row).children('td:nth-of-type(3)').text(adjustedHours);
    });
    // Regenerate the CSV with the adjusted date range (and new title)
    var newCSV = Utils.generateCSV(Users.IDs, 'Last Name,First Name,Class of,Total III Hours Awarded (Adjusted),Courses In Progress,Courses Completed', ['last_name', 'first_name', 'au_graduation_year', [users.calculateHours, [dateRange]],
        users.coursesInProgress, [users.coursesCompleted, [dateRange]]], 'ALiEMU_Program_Export_' +
        dateRange.fromDate.toLocaleDateString().replace(/\//g, '-') + '_to_' +
        dateRange.toDate.toLocaleDateString().replace(/\//g, '-'));
    // Apply the new CSV blob to the `export-all` button
    utils.downloadPolyfill(newCSV, 'export-all');
});
/***********************************************************
 *                     CHANGE EVENTS                       *
 ***********************************************************/
// ## Change events
// ### Course selection `select` box
$('#course-selection').on('change', function (event) {
    var courseID = event.currentTarget.value, userArray = [], key = 'course_completed_' + courseID, lessonNames = '', lessonIDs, csvObj;
    $('#au-course-overview-table>tbody').html('');
    // **If no course is selected...**
    // - Hide the entire table
    // - Disable the export button
    // - Trigger paginate (which ends up hiding pagination)
    // - Return
    if (courseID === '0') {
        $('#au-course-overview-table').hide();
        $('#export-course-data').toggleClass('disabled', true);
        utils.paginate('au-course-overview-table');
        return;
    }
    // If the export button is disabled, enable it
    $('#export-course-data').toggleClass('disabled', false);
    // **For each user available to the current educator...**
    // If the user has completed the currently selected course...
    // - Push an object containing the user's ID and completion timestamp
    //  to userArray.
    // - If lessonIDs has not yet been defined, push the courseIDs of
    //  every lesson to the lessonIDs array.
    _.each(Users.data, function (user, index) {
        var keys = _.keys(user);
        if (keys.indexOf(key) > -1) {
            userArray.push(Users.data[index]);
            if (lessonIDs === undefined) {
                lessonIDs = _.keys(user['_sfwd-course_progress'][courseID].lessons);
            }
        }
    });
    $('#au-course-overview-table>tbody').append(Components.tableRow(userArray, [
        { param: 'display_name' },
        { param: users.courseCompletionDate, args: [courseID] }
    ]));
    // Show the table once the data fetching / generation has completed
    $('#au-course-overview-table').show();
    utils.paginate('au-course-overview-table');
    // **The following code executes in the background**
    // For each lessonID, concatenate the lesson name to lessonNames (with formatting)
    _.each(lessonIDs, function (ID) {
        lessonNames += "Lesson: " + Courses.lessons[ID].post_title + ",";
    });
    // Generate a CSV File Glob using the previously collected data (Export Program Data)
    csvObj = Utils.generateCSV(Users.IDs, "Last Name,First Name,Course Completed," + lessonNames, ['last_name', 'first_name', [users.courseCompletionDate, [courseID]], [users.checkLessonCompletion, [courseID, lessonIDs]]], Courses.data[courseID].post_title);
    // Attach the generated CSV object using polyfill to the "export-program-data" link
    utils.downloadPolyfill(csvObj, 'export-course-data');
});
// ### Repaginate the main table when visible row variable is changed
$(utils.rowSelect.element).on('change', function (event) {
    utils.paginate('au-enrolled-students-table');
});
/********************************************************************
 *                         KEYUP EVENTS                             *
 ********************************************************************/
// ## Keyup Events
// ### Search query `input` box
$('#search-query').on('keyup', function (e) {
    // Save the current contents of the input field as a regex expression
    // (global, case-insensitive, multiline)
    var query = new RegExp(e.currentTarget.value, 'gim');
    // For each row in the table...
    $('#au-enrolled-students-table>tbody>tr').each(function (id, row) {
        // If the query doesn't match the row test, filter it out
        if (row.textContent.match(query)) {
            $(row).toggleClass('filtered-row', false);
        }
        else {
            $(row).toggleClass('filtered-row', true);
        }
    });
    utils.paginate('au-enrolled-students-table');
});
