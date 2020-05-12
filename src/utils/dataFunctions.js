export const site = "hosports";

export const GetTvVideos = async () =>{
  const videos = await FindFromParse("Videos",[{method:"equalTo",key:"site",value:site},{method:"limit",value:1000}]);
  return videos
}
