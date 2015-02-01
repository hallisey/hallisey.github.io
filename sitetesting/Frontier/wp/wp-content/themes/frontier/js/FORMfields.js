/**
 * The FORMfields Library
 * The file contains a collection of JavaScript routines used by FORMfields.
 * Copyright 2005-2007 Brain Book Software LLC
 * For complete documentation, please visit http://www.formfields.com
 */

/**
 * Sets the current focus to the 1st element in the 1st form, if a form exists.
 * @since FORMfields v1.0
 */
function setFocus()
{
	if (document.forms.length > 0) {
		var form = document.forms[0];
		for (i = 0; i < form.length; i++) {
			if ( !form.elements[i].disabled
				&& ( (form.elements[i].type == "text") 
					|| (form.elements[i].type == "textarea")
					|| (form.elements[i].type == "select-one")
					|| (form.elements[i].type == "select-multiple")
					|| (form.elements[i].type == "radio")
					|| (form.elements[i].type == "checkbox")
					|| (form.elements[i].type == "password") ) ) {
				// Don't set the focus if there is an anchor in the URL
				var parts = window.location.href.split("#");
				if (parts.length == 1)
					document.forms[0].elements[i].focus();
				return;
			}
		}
	}
}

/**
 * Sets the current focus to the 1st text element in the 1st form, if a form exists.
 * @since FORMfields v1.0
 */
function setTextFocus()
{
	if (document.forms.length > 0) {
		var field = document.forms[0];
		for (i = 0; i < field.length; i++) {
			if ( !form.elements[i].disabled
				&& ( (field.elements[i].type == "text") 
					|| (field.elements[i].type == "textarea")
					|| (field.elements[i].type == "password") ) ) {
				// Don't set the focus if there is an anchor in the URL
				var parts = window.location.href.split("#");
				if (parts.length == 1)
					document.forms[0].elements[i].focus();
				return;
			}
		}
	}
}

/**
 * If id exists, sets the inner HTML. This is useful for dynamically populating
 * the content of an element.
 * @param string id the element id
 * @param string html the html to insert
 * @since FORMfields v1.0
 */
function setInnerHtml(id, html)
{
	if ( (elmnt = document.getElementById(id)) != null)
		elmnt.innerHTML = html;
}

/**
 * If id exists, clears the inner HTML. 
 * @param string id the element id
 * @since FORMfields v1.0
 */
function clearInnerHtml(id)
{
	setInnerHtml(id, '');
}

/**
 * Restricts the user from entering more than maxLen characters.
 * @param element cur the element to apply the restriction to
 * @param int maxLen the max length of characters permitted
 * @param string cntId the id of the element reporting the characters left count
 * @param event event the key press event
 * @since FORMfields v1.0
 */
function restrict(cur, maxLen, cntId, event)
{
	var keyCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
	if (keyCode == 38 || keyCode == 40) // ignore up or down arrows
		return;
	charsLeft = (maxLen - cur.value.length);
	if (charsLeft < 0)
		charsLeft = 0;
	if ( (elmnt = document.getElementById(cntId)) != null)
		elmnt.innerHTML = charsLeft;
	if (cur.value.length > maxLen) {
		cur.value = cur.value.substr(0, maxLen);
	}
}

/**
 * Processes an enter event.
 * @param element field the element where the enter occured
 * @param event event the key press event
 * @since FORMfields v1.0
 */
function enterTabHandler(field, event)
{
	var keyCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
	if (keyCode == 13) {
		for (j = 0; j < field.form.elements.length; j++) {
			if (field == field.form.elements[j]) {
				break;
			}
		}
		j = (j + 1) % field.form.elements.length;
		if (!field.form.elements[j].disabled && field.form.elements[j].type != 'hidden') {
			field.form.elements[j].focus();
		}
		return false;
	} else {
		return true;
	}
}

/**
 * Disables the default action associated with the user pressing enter.
 * @param event event the key press event
 * @since FORMfields v1.0
 */
function disableEnter(event)
{
	var keyCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
	if (keyCode == 13) {
		return false;
	} else {
		return true;
	}
}

/**
 * Causes a submit button to be clicked when enter is pressed while editing a field.
 * @param event event the key press event
 * @param int sbId the ID of the submit button to submit with
 * @since FORMfields v3.0
 */
function enterSubmits(event, sbId)
{
	var keyCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
	if (keyCode == 13) {
		sb = document.getElementById(sbId);
		if (sb != null) {
			sb.click();
		}
		return false;
	} else {
		return true;
	}
}

/**
 * Opens a new window for FORMfields calendar/date chooser.
 * @param string id the id of the form field associated with this calendar
 * @param string startYear a four digit year equal to the earliest year permitted by the calendar
 * @param string endYear a four digit year equal to the latest year permitted by the calendar
 * @param string calendarUrl the URL to the FORMfields calendar
 * @since FORMfields v2.0
 */
function showCalendar(id, startYear, endYear, calendarUrl)
{
	url = calendarUrl + "/calendar.php?id=" + id + "&year=" + document.getElementById(id + "_" + "year").value + "&month=" + document.getElementById(id + "_" + "month").value + "&startYear=" + startYear + "&endYear=" + endYear;
	window.open(url, "Calendar", "resizable=YES,height=280,width=450");
}

/**
 * Dynamically sets the date of a FORMfields date field.
 * @param string id the id of the calling form field
 * @param string year the four digit year
 * @param string month the two digit month
 * @param string day the two digit day
 * @since FORMfields v2.0
 */
function setDate(id, year, month, day)
{
	document.getElementById(id + "_" + "year").value = year;
	document.getElementById(id + "_" + "month").value = month;
	document.getElementById(id + "_" + "day").value = day;
	document.getElementById(id + "_" + "year").focus();
}

/**
 * Opens a new window for FORMfields palette/color chooser.
 * @param string id the id of the form field associated with this palette
 * @param string ffRootUrl the URL to the FORMfields root
 * @since FORMfields v2.0
 */
function showPalette(id, ffRootUrl)
{
	url = ffRootUrl + "/palette.php?id=" + id;
	window.open(url, "Calendar", "status=YES,resizable=YES,height=350,width=550");
}

/**
 * Used by the palette to set the color value of the ColorChooserField after a
 * color has been selected.
 * @param string id the id of the form field associated with the palette
 * @param string color the color picked by the user
 * @since FORMfields v2.0
 */
function setColor(id, color)
{
	document.getElementById(id).value = color;
	document.getElementById(id).focus();
}

/**
 * Used by fields that have refresh buttons to remove the anchor and add an
 * anchor to themselves so that the focus is set on the field that just
 * caused the refresh.
 * @param string url a URL
 * @since FORMfields v3.0
 */
function removeAnchor(url)
{
	parts = url.split("#");
	return parts[0];
}

// Enhancement: could use elmnt.tabIndex to simplify logic
/**
 * Returns the form element after the specified element or null if none exists.
 * @param element elmt an element
 * @return element the form element after the specified element or null if none exists
 * @since FORMfields v3.0
 */
function getNextElement(elmt) 
{
	// find i,j for the current element
	outer:
	for (i = 0; i < document.forms.length; i++) {
		for (j = 0; j < document.forms[i].elements.length; j++) {
			if (document.forms[i].elements[j] == elmt) {
				if (j < document.forms[i].elements.length - 1) { // not last elmt in form
					j++;
					break outer;
				} else if (i < document.forms.length - 1) { // go to 1st element of next form
					i++;
					j = 0;
					break outer;
				} else {
					return null;
				}
			}
		}
	}

	// legends appear to be elements, but they are undefined
	for (m = i; m < document.forms.length; m++) {
		for (n = j; n < document.forms[m].elements.length; n++) {
			if (document.forms[m].elements[n].name != undefined) {
				return document.forms[m].elements[n];
			}
		}
	}
	return null;
}

/**
 * Returns true if element e is contained in element a.
 * @param element a the container element
 * @param element e the contained element
 * @return boolean true if element e is contained in element a
 * @since FORMfields v3.0
 */
function containsElement(a, e) 
{
	for (i = 0; i < a.length; i++) {
		if (a[i] == e) {
			return true;
		}
	}
	return false;
}

/**
 * This function is used in debugging and prints an alert message of all the
 * elements on a page.
 * @since FORMfields v3.0
 */
function printElements() 
{
	str = "";
	for (i = 0; i < document.forms.length; i++) {
		for (j = 0; j < document.forms[i].elements.length; j++) {
			str = str + "document.forms[" + i + "].elements[" + j + "].name = " + document.forms[i].elements[j].name + "\n";
		}
	}
	alert(str);
}

/**
 * Automatically tabs to the next field when this field has been completely filled in.
 * @param element cur the element utilizing auto tab
 * @param event even the key press event
 * @since FORMfields v3.0
 */
function autoTab(cur, event) 
{
	// Make sure that we only autoTab when a printable char is entered, i.e. not on a tab
	// Key Codes for IE, FF, NS and Opera are the same:
	// - Back space: 8
	// - Tab: 9
	// - Shift: 16
	// - Ctrl: 17
	// - Alt: 18
	// - Caps lock: 20
	// - End: 35
	// - Home: 36
	// - Arrows: 37, 38, 39 , 40
	// - Delete: 46
	//alert(event.keyCode);
	var keyCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
	var filter = [8, 9, 16, 17, 18, 20, 35, 36, 37, 38, 39, 40, 46];
	if (cur.value.length == cur.maxLength && !containsElement(filter, keyCode)) {
		next = getNextElement(cur);
		if (next != null)
			next.focus();
	}
}