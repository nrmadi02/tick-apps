import { Icon, Map } from "leaflet";
import { Search } from "lucide-react";
import React, { useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMapEvent,
} from "react-leaflet";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";

interface LocationPickerProps {
  value?: { latitude: number; longitude: number };
  onChange?: (location: { latitude: number; longitude: number }) => void;
}

function SetViewOnClick({
  animateRef,
}: {
  animateRef: React.MutableRefObject<boolean>;
}) {
  const map = useMapEvent("click", (e) => {
    map.setView(e.latlng, map.getZoom(), {
      animate: animateRef.current || false,
    });
  });

  return null;
}

const LocationMarker = ({
  position,
  onChange,
}: {
  position?: { latitude: number; longitude: number };
  onChange: (location: { latitude: number; longitude: number }) => void;
}) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      console.log({ lat, lng });
      onChange({ latitude: lat, longitude: lng });
    },
  });

  const icon = new Icon({
    iconUrl: "/pin.png",
    iconSize: [25, 25],
    iconAnchor: [12, 41],
  });

  return position ? (
    <Marker icon={icon} position={[position.latitude, position.longitude]} />
  ) : null;
};

export default function LocationPicker({
  value,
  onChange,
}: LocationPickerProps) {
  const animateRef = useRef(true);
  const mapRef = useRef<Map>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const defaultPosition = {
    latitude: -3.436403609661765,
    longitude: 114.82304342561905,
  }; // Banjarbaru
  const [position, setPosition] = useState(value || defaultPosition);

  const handleChange = (newPosition: {
    latitude: number;
    longitude: number;
  }) => {
    setPosition(newPosition);
    onChange?.(newPosition);
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`,
      );
      const data = await response.json();
      if (data && data[0]) {
        const newPosition = {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon),
        };
        handleChange(newPosition);
        mapRef.current?.setView(
          [newPosition.latitude, newPosition.longitude],
          mapRef.current?.getZoom(),
        );
      }
    } catch (error) {
      console.error("Error searching location:", error);
    }
  };

  return (
    <div className="flex w-full items-center gap-4">
      <Input
        type="text"
        placeholder="Latitude"
        value={position.latitude}
        onChange={(e) =>
          handleChange({ ...position, latitude: parseFloat(e.target.value) })
        }
      />
      <Input
        type="text"
        placeholder="Longitude"
        value={position.longitude}
        onChange={(e) =>
          handleChange({ ...position, longitude: parseFloat(e.target.value) })
        }
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="default" className="w-full">
            Pilih Lokasi di Peta
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Pilih Lokasi</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Cari lokasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button onClick={handleSearch}>
                <Search className="size-4" />
              </Button>
            </div>

            <div className="h-[400px] w-full overflow-hidden rounded-md border">
              <MapContainer
                center={[position.latitude, position.longitude]}
                zoom={10}
                className="size-full rounded-md"
                scrollWheelZoom={true}
                ref={mapRef}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker position={position} onChange={handleChange} />
                <SetViewOnClick animateRef={animateRef} />
              </MapContainer>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
