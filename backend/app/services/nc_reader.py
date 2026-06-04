import xarray as xr
import numpy as np
from app.config import settings


def load_dataset(name: str) -> xr.Dataset:
    path = settings.DATA_DIR / f"{name}.nc"
    if not path.exists():
        raise FileNotFoundError(f"Dataset not found at: {path}")
    try:
        return xr.open_dataset(path, chunks={})
    except ImportError:
        return xr.open_dataset(path)


def extract_rainfall(
    ds: xr.Dataset,
    date: str,
    lat_min: float = None,
    lat_max: float = None,
    lon_min: float = None,
    lon_max: float = None,
) -> dict:
    # Detect dimension names — IMD datasets often use uppercase
    time_dim = next((d for d in ["TIME", "time", "YEAR", "year"] if d in ds.dims), None)
    lat_dim  = next((d for d in ["LATITUDE", "lat", "LAT", "latitude"] if d in ds.dims), None)
    lon_dim  = next((d for d in ["LONGITUDE", "lon", "LON", "longitude"] if d in ds.dims), None)

    if not all([time_dim, lat_dim, lon_dim]):
        raise ValueError(
            f"Could not detect required dims. Found: {list(ds.dims)}. "
            f"Detected: time={time_dim}, lat={lat_dim}, lon={lon_dim}"
        )

    rain_var = _detect_rain_var(ds)
    da = ds[rain_var]

    # Time selection — fall back to first time step if nearest-match fails
    try:
        da = da.sel({time_dim: date}, method="nearest")
    except Exception:
        da = da.isel({time_dim: 0})

    # Optional spatial bounding box
    if all(v is not None for v in [lat_min, lat_max, lon_min, lon_max]):
        da = da.sel({
            lat_dim: slice(lat_min, lat_max),
            lon_dim: slice(lon_min, lon_max),
        })

    values = da.values
    lats   = da.coords[lat_dim].values.tolist()
    lons   = da.coords[lon_dim].values.tolist()

    # Replace NaN and IMD fill values (-999 etc.) with None for valid JSON
    values_clean = np.where(np.isnan(values) | (values < 0), None, values).tolist()

    return {
        "variable": rain_var,
        "lats": lats,
        "lons": lons,
        "values": values_clean,
        "units": ds[rain_var].attrs.get("units", "mm"),
    }


def _detect_rain_var(ds: xr.Dataset) -> str:
    candidates = ["rf", "rain", "rainfall", "precip", "precipitation",
                  "RAIN", "RF", "RAINFALL", "PRCP", "prcp"]
    for c in candidates:
        if c in ds.data_vars:
            return c
    return list(ds.data_vars)[0]
