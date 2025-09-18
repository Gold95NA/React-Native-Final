export type RootStackParamList = {
  Tabs: undefined;
  SettingsModal: undefined;
};

export type RootTabParamList = {
  AirStack: undefined;
  PlacesStack: undefined;
  SavedStack: undefined;
};

export type AirStackParamList = {
  AirList: undefined;
  AirDetail: { city: string; lat: number; lon: number };
};

export type PlacesStackParamList = {
  PlacesNearby: undefined;
  PlaceDetail: { id: string; name: string; lat: number; lon: number; address?: string };
};

export type SavedStackParamList = {
  SavedList: undefined;
  SavedDetail: { kind: 'city' | 'place'; name: string; lat: number; lon: number };
};