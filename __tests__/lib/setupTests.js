module.exports = async () => {
  const xml = require('xml');
  const path = require('path');
  const fs = require('fs');
  await import('libxml2-wasm').then(({ XmlDocument, XsdValidator }) => {
    global.expect.extend({
      toBeCompliantJUnit(jsonResults) {    
        const schemaPath = path.join(__dirname, 'junit.xsd');
        const schema = XmlDocument.fromBuffer(fs.readFileSync(schemaPath));
        const validator = XsdValidator.fromDoc(schema);
    
        const xmlStr = xml(jsonResults, { indent: '  '});
    
        const doc = XmlDocument.fromString(xmlStr);
    
        try {
          validator.validate(doc);
    
          return {
            message: () => `expected not to validate against junit xsd`,
            pass: true
          }
        } catch (err) {
          return {
            message: () => `${err.message}\n${xmlStr}`,
            pass: false
          }
        }
      }
    });
  });
};


// import ('libxml2-wasm').then(({XmlDocument, XsdValidator}) => {
//   const schemaPath = path.join(__dirname, 'junit.xsd');
//   const schema = XmlDocument.fromBuffer(fs.readFileSync(schemaPath));
//   const validator = XsdValidator.fromDoc(schema);
  
//   console.log('Here');
//   global.expect.extend({
//     toBeCompliantJUnit(jsonResults) {
//       const xmlStr = xml(jsonResults, { indent: '  '});
  
//       const doc = XmlDocument.fromBuffer(xmlStr);
  
//       try {
//         validator.validate(doc);
  
//         return {
//           message: () => `expected not to validate against junit xsd`,
//           pass: true
//         }
//       } catch (err) {
//         return {
//           message: () => `${err.message}\n${xmlStr}`,
//           pass: false
//         }
//       }
//     }
//   });
// });
