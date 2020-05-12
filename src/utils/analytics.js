import ReactGA from 'react-ga';

var location = window.location.host;
if(location.includes("www.thewakeco.com")){
  ReactGA.initialize('UA-113392157-2');
}
if(location.includes("tv.thewakeco.com")){
  ReactGA.initialize('UA-113392157-3');
}
