/**
 * Method with util methods to work with Strings
 */
class StrUtils {

    /**
     * Method to replace data from a string
     * @param {string} str String to replace the data
     * @param {string} replace String to replace
     * @param {string} replacement String to replacement
     * 
     * @returns {string} Returns the the String with data replaced
     */
    static replace(str, replace, replacement) {
        return str.split(replace).join(replacement);
    }

    /**
     * Method to count the ocurrences into the String
     * @param {string} str Source to check
     * @param {string} strToCheck String to check if exists on str
     * 
     * @returns {number} true if "strToCheck" exists on "str", false in otherwise
     */
    static count(str, strToCheck) {
        return (str.match(new RegExp(strToCheck, 'g')) || []).length;
    }

    /**
     * Method to check if a String contains other String
     * @param {string} str Source to check
     * @param {string} strToCheck String to check if exists on str
     * 
     * @returns {boolean} true if "strToCheck" exists on "str", false in otherwise
     */
    static contains(str, strToCheck) {
        return str.indexOf(strToCheck) !== -1;
    }

    /**
     * Method to check if a String contains other String ignoring letter case
     * @param {string} str Source to check
     * @param {string} strToCheck String to check if exists on str
     * 
     * @returns {boolean} true if "strToCheck" exists on "str", false in otherwise
     */
    static containsIgnorecase(str, strToCheck) {
        return str.toLowerCase().indexOf(strToCheck.toLowerCase()) !== -1;
    }

    static normalize(value, toUpper) {
        if (!value) {
            return value;
        }
        let normalized = value.toLowerCase();
        normalized = normalized.replace(/[é]/g, 'e');
        normalized = normalized.replace(/[ú]/g, 'u');
        normalized = normalized.replace(/[í]/g, 'i');
        normalized = normalized.replace(/[á]/g, 'a');
        normalized = normalized.replace(/[ó]/g, 'o');
        normalized = normalized.replace(/[^a-zA-Z0-9\s]/g, '').trim();
        return toUpper ? normalized.toUpperCase() : normalized;
    }
}
module.exports = StrUtils;