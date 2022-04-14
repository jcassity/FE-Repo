const fs = require("fs").promises
const path = require('path');
const { logMissingFile, hasFile, gitio } = require("../utilities")

const ROOT_DIR_SLUG = "Item Icons"
const ROOT_DIR = "./" + ROOT_DIR_SLUG
const REPO_URL = "https://github.com/Klokinator/FE-Repo/tree/main"
const ASSET_URL = "https://raw.githubusercontent.com/Klokinator/FE-Repo/main"
const README_FILENAME = "README.md"

/**
 * Parses the "Item Icons" dirs and gathers all the Icons in a flat list.
 *
 * @returns {Object[]}
 */
 const searchIcons = async () => {
	const itemIconFiles = await fs.readdir(ROOT_DIR, { withFileTypes: true })
	const categoryDirectories = itemIconFiles.reduce((accumulator, categoryFile) => {
		if (categoryFile.isDirectory()) accumulator.push(categoryFile.name)
		return accumulator
	}, [])

	let readMeContent = '';

	// just use first directories for now for testing
	//temp = [categoryDirectories[0], categoryDirectories[1]];
    for (const directory of categoryDirectories) {
	//for (const directory of temp) {
        console.log(directory);
        const files = await fs.readdir(ROOT_DIR + "/" + directory);
		//clean up the filenames
		const cleanFileNames = files.filter(x => !x.toLowerCase().includes('readme'));

		readMeContent += '\n\n\n';

		for (const file of cleanFileNames) {
			var fileName = file;
			var filepath= `${ROOT_DIR_SLUG}/${directory}/${fileName}`;
			var uri= encodeURI(`${ASSET_URL}/${filepath}`).replace("+", "%2B");
			var gitPath = await gitio(uri);

			readMeContent += `![${fileName}](${gitPath || uri || directory + "/" + filepath} "${fileName}")`;
		}
    }

	fs.writeFile(`${ROOT_DIR}/${README_FILENAME}`, readMeContent);
}

searchIcons()