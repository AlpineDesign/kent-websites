//import Parse from 'parse/react-native';
import Parse from 'parse';
Parse.initialize("hosports", "F8327E9C9454387CFA29D96BFC16E");
Parse.serverURL = 'https://alpine-hosports.herokuapp.com/parse/';

export const IncrementParseObject = async (className, id, attribute) =>{
  const Query = Parse.Object.extend(className);
  const query = new Parse.Query(Query);
  const result = await query.get(id);
  var value = result.attributes[attribute];
  if(!value){
    value = 0
  }
  value = value +1;
  result.set(attribute,value)
  result.save();
  return result;
}

export const GetFromParse = async (className, id) =>{
  const Query = Parse.Object.extend(className);
  const query = new Parse.Query(Query);
  const result = await query.get(id);
  return result
}

export const FindFromParse = async (className, filters) =>{
  const Query = Parse.Object.extend(className);
  const query = new Parse.Query(Query);
  if(filters){
    for (var i = 0; i < filters.length; i++) {
      var filter = filters[i];
      if(!filter.key){
        query[filter.method](filter.value)
      } else{
        query[filter.method](filter.key,filter.value)
      }
    }
  }
  const results = await query.find();
  return results
}

export const GetFromParseBySlug = async (className, slug) =>{
  const Query = Parse.Object.extend(className);
  const query = new Parse.Query(Query);
  query.equalTo("slug", slug);
  const result = await query.first();
  return result
}

export const UpdateParse = async (className, id, key, value) =>{
  const Query = Parse.Object.extend(className);
  const query = new Parse.Query(Query);
  const result = await query.get(id);
  result.set(key,value);
  result.save();
  return result;
}

export const RunParseCloudFunction = async (func,data) =>{
  let response = await Parse.Cloud.run(func,data)
  return response;
}
