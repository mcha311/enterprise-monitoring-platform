def test_low_battery_alert(client):
    client.post("/devices/", json={
        "name": "Low",
        "type": "robot",
        "status": "active",
        "battery_level": 10,
        "location_x": 0,
        "location_y": 0,
        "is_online": True
    })

    res = client.get("/alerts/low-battery")
    assert res.status_code == 200
    assert res.json()[0]["battery_level"] < 20
