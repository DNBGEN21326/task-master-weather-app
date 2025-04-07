
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface WeatherData {
  location: string;
  temperature: number;
  description: string;
  icon: string;
}

interface WeatherState {
  data: Record<string, WeatherData>;
  isLoading: boolean;
  error: string | null;
}

const initialState: WeatherState = {
  data: {},
  isLoading: false,
  error: null,
};

// OpenWeatherMap API key (this is a mock key, replace with a real one)
const API_KEY = '3d32e00826be4c49af161302232504';
const BASE_URL = 'https://api.weatherapi.com/v1/current.json';

export const fetchWeatherByLocation = createAsyncThunk(
  'weather/fetchByLocation',
  async (location: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}?key=${API_KEY}&q=${location}&aqi=no`);
      
      if (!response.ok) {
        throw new Error('Weather data not available');
      }
      
      const data = await response.json();
      
      return {
        location,
        temperature: data.current.temp_c,
        description: data.current.condition.text,
        icon: data.current.condition.icon,
      };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherByLocation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWeatherByLocation.fulfilled, (state, action: PayloadAction<WeatherData>) => {
        state.isLoading = false;
        state.data[action.payload.location] = action.payload;
      })
      .addCase(fetchWeatherByLocation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default weatherSlice.reducer;
