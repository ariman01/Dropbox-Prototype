console.log("hello");

files = ["/Users/oori/Desktop/testJS1.js",
         "/Users/oori/Desktop/testJS15.js",
         "/Users/oori/Desktop/testJS13.js",
         "/Users/oori/Desktop/testJS12.js",
         "/Users/oori/Desktop/testJS11.js",
         "/Users/oori/Desktop/Dir1",
         "/Users/oori/Desktop/Dir2",
         "/Users/oori/Desktop/Dir2/test1.txt",
         "/Users/oori/Desktop/test/testfile1.js",
         "/Users/oori/Desktop/test/testFile2.js",
         "/Users/oori/Desktop/test/Dir3/testJS.js"
        ]
function parseFileAndDirectoryPath(currentDir,srcFilesDirs){
    var fileDirSet = new Set();
    for (var file in srcFilesDirs){
        if(){
            let filestr = srcFilesDirs[file].replace(currentDir,'');
            fileDirSet.add(filestr.split("/")[0]);
        }
        
    }
    console.log(fileDirSet);
    console.log(fileDirSet.size);
    fileDirSet.forEach((value)=>{
        console.log(value);
    });
    
}

parseFileAndDirectoryPath("/Users/oori/Desktop/Dir2",files);