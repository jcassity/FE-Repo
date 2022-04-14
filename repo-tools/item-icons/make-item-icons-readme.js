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
	const perChunk = 4;

    for (const directory of categoryDirectories) {
        console.log(directory);
        const files = await fs.readdir(ROOT_DIR + "/" + directory);
		//clean up the filenames
		const cleanFileNames = files.filter(x => !x.toLowerCase().includes('readme'));

		//chunk them into groups of 3
		const chunkedFiles = cleanFileNames.reduce((resultArray, item, index) => {
			const chunkIndex = Math.floor(index/perChunk)

			if(!resultArray[chunkIndex]) {
				resultArray[chunkIndex] = [] // start a new chunk
			}

			resultArray[chunkIndex].push(item)

			return resultArray
		}, [])

		//loop through the sets and add them to the readme
		readMeContent += '\n\n\n';
		let cellCtr = 0;
		let rowCtr = 0;

		var cellObjArr = []; 
		for (const row of chunkedFiles) {
			const cleanNames = row.map(cell => {
				const fileTitle = path.parse(cell).name;
				// break up the name
				const names = fileTitle.match(/\{(.*?)\}/);
				const file = fileTitle.replace(/\s?\{[^}]+\}/g, '');

				const correctName = names && names.length > 0 ? names[0] : '';

				return `${file} <br> ${correctName}`;
			});

			const spacers = row.map(cell => ' :---: ');

			var cellObjArray = [];
			for (const cell of row) {
				var fileName = cell;
				var filepath= `${ROOT_DIR_SLUG}/${directory}/${fileName}`;
				var uri= encodeURI(`${REPO_URL}/${filepath}`).replace("+", "%2B");
				var gitPath = await gitio(uri);
				var obj = {
					fileName: fileName,
					path: filepath,
					uri: uri,
					gitio: gitPath
				}
				cellObjArr.push(obj);
			}

			const images = cellObjArr.map(cell => {
				const fileName = cell.fileName;

				return `![${fileName}](${cell.gitio || cell.uri || directory + "/" + cell.path})`;
			});

			readMeContent += `|${cleanNames.join('|')}|\n`;
			readMeContent += `|${spacers.join('|')}|\n`;
			readMeContent += `|${images.join('|')}|\n`;
			readMeContent += '\n\n'
			rowCtr++;
		}
    }

	fs.writeFile(`${ROOT_DIR}/${README_FILENAME}`, readMeContent);

    return null;

    try {
		//get the files
		const filesNames = await fs.readdir(directory);
		//clean up the filenames
		const cleanFileNames = filesNames.filter(x => !x.toLowerCase().includes('readme'));

		//chunk them into groups of 3
		const chunkedFiles = cleanFileNames.reduce((resultArray, item, index) => {
			const chunkIndex = Math.floor(index/perChunk)

			if(!resultArray[chunkIndex]) {
				resultArray[chunkIndex] = [] // start a new chunk
			}

			resultArray[chunkIndex].push(item)

			return resultArray
		}, [])

		//loop through the sets and add them to the readme
		readMeContent += '\n\n\n';
		let cellCtr = 0;
		let rowCtr = 0;
		chunkedFiles.forEach(row => {
			const cleanNames = row.map(cell => {
				const fileTitle = path.parse(cell).name;
				// break up the name
				const names = fileTitle.match(/\{(.*?)\}/);
				const file = fileTitle.replace(/\s?\{[^}]+\}/g, '');

				const correctName = names && names.length > 0 ? names[0] : '';

				return `${file} <br> ${correctName}`;
			});

			const spacers = row.map(cell => ' :---: ');

			const images = row.map(cell => {
				const fileName = path.parse(cell).name;
				const fullPath = `${rootPath}/${categoryPath}/${classCardPath}/${cell}`;

				return `<img alt="${fileName}" src="${cell}" />`;
			});

			readMeContent += `|${cleanNames.join('|')}|\n`;
			readMeContent += `|${spacers.join('|')}|\n`;
			readMeContent += `|${images.join('|')}|\n`;
			readMeContent += '\n\n'
			rowCtr++;
		});

	}catch(e){
		console.log(e);
	}
}

searchIcons()