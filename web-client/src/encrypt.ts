import { Field, PublicKey, PrivateKey, Encoding, Encryption, Group } from 'o1js';

/*
See: 
- https://docs.minaprotocol.com/zkapps/o1js-reference/modules/Encryption
- https://docs.minaprotocol.com/zkapps/o1js-reference/modules/Encoding#stringtofields
*/

export { CypherText };

interface CypherTextObject {
  cipherText: Field[];
  publicKey: Group;
}

class CypherText {

  static stringify(cipherText: CypherTextObject): string {
    return JSON.stringify(cipherText);
  }

  static parse(jsonStr: string): CypherTextObject {
    let obj = JSON.parse(jsonStr);
    return {
      publicKey: new Group(obj.publicKey),
      cipherText: (obj.cipherText || []).map((t: string) => Field(t))
    }
  }

  static encrypt(
    message: string, 
    publicId: string
  ): string {
    try {
      let fields: Field[] = Encoding.stringToFields(message);
      let encripted = Encryption.encrypt(
        fields, 
        PublicKey.fromBase58(publicId)
      )
      return CypherText.stringify(encripted) ;
    }
    catch (err) {
      throw Error(
        `Could not encrypt message='${message}' using key='${publicId}'.`
        +` Error ${err}`
      )
    }
  }  
  
  static decrypt(
    cipherText: string, 
    privateKey: string
  ): string {
    try {
      let fields = Encryption.decrypt(
        CypherText.parse(cipherText), 
        PrivateKey.fromBase58(privateKey)
      );
      let decrypted = Encoding.stringFromFields(fields);
      return decrypted
    }
    catch (err) {
      throw Error(
        `Could not decrypt cipher='${cipherText}'.`
        +` Error ${err}`
      )
    }
  }
}
