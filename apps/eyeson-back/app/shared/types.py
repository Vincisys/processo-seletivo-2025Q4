from pydantic_extra_types.phone_numbers import PhoneNumber


class BRAPhone(PhoneNumber):
    default_region_code = 'BR'
    supported_regions = ['BR']

