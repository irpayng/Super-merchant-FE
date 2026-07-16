'use client';

import { HeaderCard } from '@/components/ui/header-card';
import { HeadphonesIcon } from 'lucide-react';
import { Copiable } from '@/components/ui/copiable';
import { Button } from '@/components/ui/button';
import MapComponent, { Coordinates } from '@/components/MapComponent';

interface TerminalDetailsProps {
  data: any;
  onClose: () => void;
  useSlider?: boolean;
}

export function TerminalDetails({ data }: TerminalDetailsProps) {
  const handleMapClick = (coordinates: Coordinates) => {
    console.log('Map clicked at:', coordinates);
  };

  const handleMarkerClick = (coordinates: Coordinates) => {
    console.log('Marker clicked at:', coordinates);
  };

  return (
    <>
      <HeaderCard
        title={
          <div className='flex flex-col gap-1'>
            <p className='text-sm text-gray-500 font-medium'>Terminal ID</p>
            <div className='flex items-center gap-1'>
              <h1 className='text-lg font-medium'>{data?.terminalId}</h1>
              <Copiable value={data?.terminalId} truncate={false} />
            </div>
          </div>
        }
        fields={[
          { label: 'Merchant ID', value: data.merchantId, copiable: true },
          {
            label: 'Status',
            value: data.status,
            badge: (status) => {
              if (status === 'Active') return 'success';
              if (status === 'Inactive') return 'warning';
              if (status === 'Offline') return 'error';
              return 'default';
            },
          },
          { label: 'Last Seen', value: data.lastSeen },
          { label: 'Printer Status', value: data.printerStatus },
          { label: 'Network', value: data.network },
          { label: 'Type', value: data.type },
          { label: 'Model', value: data.model },
          { label: 'Serial Number', value: data.serialNumber, copiable: true },
          { label: 'Software', value: data.software },
        ]}
        headerAction={
          <Button
            className='border border-[#EAECF0] h-[30px] px-2'
            variant='outline'
          >
            <HeadphonesIcon className='text-[#FC6401] mr-2 w-4 h-4' />
            <span className=' text-sm'>Request Support</span>
          </Button>
        }
      />

      <div className='mt-2'>
        <MapComponent
          key={`${data?.serial}-${data?.location}`}
          coordinates={data.mapCoordinates}
          title={`Terminal Location on Map`}
          locationName={data?.terminalLocation || 'Terminal Location'}
          height='360px'
          showFullMapButton={false}
          showMarker={true}
          markerColor='#FC6401'
          onMapClick={handleMapClick}
          onMarkerClick={handleMarkerClick}
          mapProvider='leaflet' // Can be changed to 'google' or 'leaflet' with proper API keys
        />
      </div>

      {/* <div className='bg-secondary dark:bg-primary/10 rounded-lg border border-gray-200 dark:border-gray-700 p-6'>
        <p className='text-base font-semibold mb-4 text-gray-900 dark:text-white'>
          Terminal Location
        </p>
        <div className='w-full h-80 rounded-lg overflow-hidden'>
          <iframe
            width='100%'
            height='100%'
            style={{ border: 0 }}
            src='https://www.openstreetmap.org/export/embed.html?bbox=3.4200,6.4500,3.4400,6.4700&layer=mapnik&marker=6.4600,3.4300'
            allowFullScreen
          />
        </div>
      </div> */}
    </>
  );
}
