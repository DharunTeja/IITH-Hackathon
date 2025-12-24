import sys
from app.models import Base
from os.path import abspath, dirname
from config import settings


sys.path.insert(0, dirname(dirname(abspath(__file__))))

target_metadata = Base.metadata

settings.set_main_option("sqlalchemy.url", settings.DATABASE_URL)
