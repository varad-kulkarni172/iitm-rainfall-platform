from pydantic import BaseModel
from typing import Optional

class DatasetQuery(BaseModel):
    dataset: str                  # filename (without .nc)
    date: str                     # "YYYY-MM" or "YYYY-MM-DD"
    lat_min: Optional[float] = None
    lat_max: Optional[float] = None
    lon_min: Optional[float] = None
    lon_max: Optional[float] = None
    aggregation: str = "none"     # none | mean | sum