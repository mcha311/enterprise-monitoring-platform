def test_create_device(client):
    res = client.post("/devices/", json={
        "name": "Test",
        "type": "robot",
        "status": "active",
        "battery_level": 80,
        "location_x": 1,
        "location_y": 1,
        "is_online": True
    })
    assert res.status_code == 200

def test_get_devices(client):
    res = client.get("/devices/")
    assert res.status_code == 200
