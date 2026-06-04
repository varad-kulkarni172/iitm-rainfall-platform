from fastapi import APIRouter, HTTPException
from app.schemas.query import DatasetQuery
from app.services.nc_reader import load_dataset, extract_rainfall

router = APIRouter(prefix="/dataset", tags=["dataset"])


@router.get("/list")
def list_datasets():
    from app.config import settings
    files = list(settings.DATA_DIR.glob("*.nc"))
    return {"datasets": [f.stem for f in files]}


@router.get("/debug/{name}")
def debug_dataset(name: str):
    """Temporary diagnostic endpoint — shows raw NC file structure."""
    try:
        ds = load_dataset(name)
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))

    # Collect time samples safely
    time_key = "TIME" if "TIME" in ds.coords else "time" if "time" in ds.coords else None
    time_sample = []
    if time_key:
        try:
            time_sample = [str(t) for t in ds.coords[time_key].values[:5]]
        except Exception:
            time_sample = ["could not read"]

            return {
        "dims": dict(ds.dims),
        "coords": list(ds.coords),
        "data_vars": list(ds.data_vars),
        "time_sample": time_sample,
        "var_attrs": {
            v: dict(ds[v].attrs) for v in list(ds.data_vars)[:3]
        },
    }


@router.post("/query")
def query_dataset(q: DatasetQuery):
    try:
        ds = load_dataset(q.dataset)
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))

    # Normalize "YYYY-MM" → "YYYY-MM-01" so xarray can parse it
    target_date = q.date
    if len(target_date) == 7:
        target_date = f"{target_date}-01"

        # These two lines must be at function scope — NOT inside the if-block above
        data = extract_rainfall(
            ds,
            target_date,
            q.lat_min,
            q.lat_max,
            q.lon_min,
            q.lon_max,
        )
        return data