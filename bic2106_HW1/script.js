var URL = "";
var KEY = "AIzaSyCNS5UFwKs4OTSW75Y4kJbxMkuUD-6RlAo";
var hashmap = {};
window.map = new Array("name", "address", "party", "phones", "urls", "photoUrl", "channels");
window.counter = 0;
window.maxRows = 10;
window.currentRows = 0;

//Append and remove buttons for the select roles
$(document).ready(function () {
    $('#roles-input').change(function () {
        var name = this.options[this.selectedIndex].getAttribute("name");
        var val = $(this).val();
        $('#roles-area').append("<div><a name='" + name + "' class='role' type='text' value='" + val + "'>" + val + "</a><button class='remove'>Remove</button></div>");
        hashmap[val] = name;
        $(this).find("option:selected").remove();
    });
    $('#roles-area').on("click", ".remove", function () {
        var val = $(this).parent().find("a").attr('value');
        var name = hashmap[val];
        //alert(val + " " + name);
        $('#roles-input').append("<option name='" + name + "' value='" + val + "'>" + val + "</option>");
        $(this).parent().remove();
    });
});

//Append and remove buttons for the select levels
$(document).ready(function () {
    $('#levels-input').change(function () {
        var name = this.options[this.selectedIndex].getAttribute("name");
        var val = $(this).val();
        $('#levels-area').append("<div><a name='" + name + "' class='level' type='text' value='" + val + "'>" + val + "</a><button class='remove'>Remove</button></div>");
        hashmap[val] = name;
        $(this).find("option:selected").remove();
    });
    $('#levels-area').on("click", ".remove", function () {
        var val = $(this).parent().find("a").attr('value');
        var name = hashmap[val];
        $('#levels-input').append("<option name='" + name + "' value='" + val + "'>" + val + "</option>");
        $(this).parent().remove();
    });
});



//obtain address input by user
function getAddress() {
    var address;
    if (document.getElementById("address-input").value !== "") {
        address = document.getElementById("address-input").value;
    }
    ;
    return address;
}

//obtain level filters
function getLevels() {
    var levels;
    levels = $('[class=level]');

    return levels;

}

//obtain role filters
function getRoles() {
    var roles;
    roles = $('[class=role]');

    return roles;
}


function next10Rows() {
    maxRows += 10;
    currentRows += 10;
    createTable();
}

function pre10Rows() {
    if (maxRows !== 10) {
        maxRows -= 10;
        currentRows -= 10;
    }
    createTable();
}

function newTable() {
    maxRows = 10;
    currentRows = 0;
    createTable();
}

//createURL
function createURL() {
    var address, levels, roles;

    address = getAddress();

    if (typeof address === 'undefined') {
        document.getElementById('address-input').style.borderColor = "red";
        return;
    }
    URL = "https://www.googleapis.com/civicinfo/v2/representatives?address=" + address;
    document.getElementById('address-input').style.borderColor = "white";

    if (document.getElementById('offices-input').checked) {
        URL += "&includeOffices=true";
        //alert("checked! URL: " + URL);
    }

    levels = getLevels();
    if (levels !== null) {
        for (var i = 0; i < levels.length; i++) {
            URL += "&levels=" + levels[i].getAttribute("name");
        }
    }

    roles = getRoles();
    if (roles !== null) {
        for (var i = 0; i < roles.length; i++) {
            URL += "&roles=" + roles[i].getAttribute("name");
        }
    }

    URL += "&key=" + KEY;

    return URL;
}



//clear table than make new one
function clearTable() {
    $('#outputs-table').remove();
    $('#outputs-header').remove();
    $('#table-appearance').html("<font color='white'></font><table id='outputs-table'><thead id='outputs-header'></thead><tbody></tbody></table>");

}
//create data
function createTable() {

    clearTable();
    URL = createURL();
    //$('#check').append("<li> URL:" + URL + "</li>");

    $.ajax({
        type: 'GET',
        url: URL,
        dataType: 'json',
        success: function (data) {

            var dataSet = new Array();
            var trHTML = '';
            var theadHTML = '';
            theadHTML += "<tr>";

            //Apply if they did check box
            var i = 0;
            if (document.getElementById('offices-input').checked) {
                theadHTML += "<th>Office</th><th>Level</th><th>Role</th>";
                $.each(data.offices, function (index, officeValue) {
                    trHTML+="<tr>";
                    $.each(officeValue, function (k, oV) {

                        if (k.valueOf() === "name") {
                            i++;
                            //$('#check').append("<li>" + oV + "</li>");
                            trHTML += "<td>" + oV + "</td>";
                            if(i===3)
                                trHTML+="</tr>";

                            return;
                        } else if (k.valueOf() === "divisionId") {
                            return;

                        } else if (k.valueOf() === "levels") {
                            i++;
                            var str = "";
                            $.each(oV, function (x, level) {
                                str += level + " ";
                            });
                            trHTML += "<td>" + str + "</td>";
                            //$('#check').append("<li>" + str + "</li>");

                            if(i===3){
                                trHTML+="</tr>";
                                i=0;
                            }
                            return;

                        } else if (k.valueOf() === "roles") {
                            i++;
                            var str = "";
                            $.each(oV, function (x, role) {
                                str += role + " ";
                            });
                            //$('#check').append("<li>" + str + "</li>");
                            trHTML += "<td>" + str + "</td></tr>";

                            if(i===3){
                                trHTML+="</tr>";
                                i=0;
                            }
                            return;

                        } else if (k.valueOf() === "officialIndices") {
                            return;

                        } else {
                            i++;
                            //$('#check').append("<li>Unavailable</li>");
                             trHTML += "<td>Unavailable</td>";
                             if(i===3){
                                trHTML+="</tr>";
                                i=0;
                            }
                            return;
                        }
                        
                    });
                    
                });
                    //alert(trHTML);
                    theadHTML += "</tr>";
                    $('#outputs-header').append(theadHTML);
                    $('#outputs-table').append(trHTML);
                


                //Standard Query
            } else {
                theadHTML += "<th>Name</th><th>Address</th><th>Party Affiliation</th><th>Phone Number</th><th>Website</th><th>Photo</th><th>Channels</th>";

                $.each(data.officials, function (key, value) {
                    trHTML += "<tr>";
                    $.each(value, function (k, v) {
                        var s = map[counter];
                        if (!value.hasOwnProperty(s)) {
                            trHTML += "<td>Unavailable</td>";
                            counter++;
                            return;
                        }
                        if (k.valueOf() === "address") {
                            $.each(v, function (index, line) {
                                trHTML += "<td>" + line.line1 + ", " + line.line2 + ", " + line.city + ", " + line.state + ", " + line.zip + "</td>";
                                return;
                            });
                        } else if (k.valueOf() === "channels") {
                            trHTML += "<td>";
                            $.each(v, function (index, line) {
                                //alert(line.type);
                                if (line.type === null) {
                                    return;
                                }
                                trHTML += line.type + " ";
                            });
                            trHTML = trHTML.replace("NaN", "");
                            trHTML += +"</td>";
                            return;
                        } else if (k.valueOf() === "photoUrl") {
                            trHTML += "<td><img src='" + v + "' height=100px width=100px  ></td>";
                        } else {
                            trHTML += "<td>" + v + "</td>";
                        }
                        counter++;

                    });

                    counter = 0;
                    trHTML += "</tr>";
                });
                theadHTML += "</tr>";
                //alert(trHTML);
                $('#outputs-header').append(theadHTML);
                $('#outputs-table').append(trHTML);
            }
        },
        error: function () {
            alert('You must enter at least an address!');
        }

    });
}
