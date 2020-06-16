import React, { useEffect, useState, useRef } from "react";

var lastInfoWindow;

function num(num) {
  return (((num || "") + "").replace(/[^0-9\.\-]/gi, "") || 0) * 1;
}

export default function Map({
  list,
  mode,
  options,
  onMount,
  className,
  onMountProps,
}) {
  const ref = useRef();
  const [map, setMap] = useState();

  useEffect(() => {
    const onLoad = () => {
      const map = new window.google.maps.Map(ref.current, options);
      const bounds = new google.maps.LatLngBounds();
      setMap(map);

      map.initialZoom = true;

      list.forEach((row) => {
        if (row.geocoordinates) {
          var infoWindowMarkup = `
          <a href="/biz/${row._slug}" style="color:#000;text-decoration:none">
          <img src="${row.primary_image.url}" width="${
            row.primary_image.width
          }" height="${
            row.primary_image.height
          }" style="max-width:100%;height:auto" />
          <div style="font-size:18px; margin:8px 0"><b>${row.name}</b></div>
          ${row.cuisines.join(", ")}
          </a>
          `;
          var infoWindow = new google.maps.InfoWindow({
            content: infoWindowMarkup,
          });

          var marker = new google.maps.Marker({
            map: map,
            position: row.geocoordinates,
            title: row.name,
          });
          //console.log('marker', marker)
          google.maps.event.addListener(marker, "click", function () {
            if (lastInfoWindow) {
              lastInfoWindow.close();
            }
            infoWindow.open(map, marker);
            lastInfoWindow = infoWindow;
          });
          bounds.extend(row.geocoordinates);
        }
      });

      map.fitBounds(bounds);
      var zoomChangeBoundsListener = google.maps.event.addListenerOnce(
        map,
        "bounds_changed",
        function (event) {
          console.log("zoom", this.getZoom());
          if (this.getZoom() > 11 && this.initialZoom == true) {
            this.setZoom(11);
            this.initialZoom = false;
          }
          google.maps.event.removeListener(zoomChangeBoundsListener);
        }
      );
    };
    if (!window.google) {
      const script = document.createElement(`script`);
      script.src =
        `https://maps.googleapis.com/maps/api/js?key=` +
        "AIzaSyBhSDubH6DP0BV3MOyV8hTWmaifQxA1Jn8";
      document.head.append(script);
      script.addEventListener(`load`, onLoad);
      return () => script.removeEventListener(`load`, onLoad);
    } else onLoad();
  }, [options, list, mode]);

  if (map && typeof onMount === `function`) onMount(map, onMountProps);

  return (
    <div
      style={{ height: mode === 'd' ? `100vh` : '50vh', margin: mode === 'd' ? 0 : '20px 0', borderRadius: mode === 'd' ? 0 : 5 }}
      {...{ ref, className }}
    />
  );
}

Map.defaultProps = {
  options: {
    center: { lat: 33.8180053, lng: -117.9875479 },
    disableDefaultUI: true,
    zoom: 11,
    styles: [
      {
        elementType: "geometry",
        stylers: [
          {
            color: "#f5f5f5",
          },
        ],
      },
      {
        elementType: "labels.icon",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#616161",
          },
        ],
      },
      {
        elementType: "labels.text.stroke",
        stylers: [
          {
            color: "#f5f5f5",
          },
        ],
      },
      {
        featureType: "administrative.land_parcel",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#bdbdbd",
          },
        ],
      },
      {
        featureType: "poi",
        elementType: "geometry",
        stylers: [
          {
            color: "#eeeeee",
          },
        ],
      },
      {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#757575",
          },
        ],
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [
          {
            color: "#e5e5e5",
          },
        ],
      },
      {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#9e9e9e",
          },
        ],
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [
          {
            color: "#ffffff",
          },
        ],
      },
      {
        featureType: "road.arterial",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#757575",
          },
        ],
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [
          {
            color: "#dadada",
          },
        ],
      },
      {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#616161",
          },
        ],
      },
      {
        featureType: "road.local",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#9e9e9e",
          },
        ],
      },
      {
        featureType: "transit.line",
        elementType: "geometry",
        stylers: [
          {
            color: "#e5e5e5",
          },
        ],
      },
      {
        featureType: "transit.station",
        elementType: "geometry",
        stylers: [
          {
            color: "#eeeeee",
          },
        ],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [
          {
            color: "#c9c9c9",
          },
        ],
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#9e9e9e",
          },
        ],
      },
    ],
  },
};

/*
      var infoWindowMarkup = '<table style="color:#000; border:0;" cellspacing=0 cellpadding=2><tr><td colspan=2 align=left><a href="'+(location.url_org || location.url)+'"><b>' + location.title + '</b></a></td><tr><td valign=top align=right><b>Address:</b></td><td>' + location.address + '</td></tr>';
      extraDisplay.forEach(function(item) {
        if (location[item]) {
          infoWindowMarkup += '<tr><td valign=top align=right><b>' + (item.charAt(0).toUpperCase() + item.slice(1)) + ':</b></td><td valign=top align=left>' + location[item] + '</td></tr>';
        }
      });
      infoWindowMarkup += '</table>';
    
      if (location.link) {
        infoWindowMarkup = '<a href="' + location.link + '" target="_blank" style="color:inherit !important; text-decoration:none">' + infoWindowMarkup + '</a>';
      }
    
      var infoWindow = new google.maps.InfoWindow({
        content: infoWindowMarkup
      });
    
      var marker = new google.maps.Marker({
        map: map,
        position: location.geocode,
        title: location.title
      });
      markerRef[location.title] = marker;
      google.maps.event.addListener(marker, 'click', function() {
        if (lastInfoWindow) {
          lastInfoWindow.close();
        }
        infoWindow.open(map, marker);
        lastInfoWindow = infoWindow;
      });

*/
