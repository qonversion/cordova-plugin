package com.qonversion.android.sdk;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

public class EntitiesConverter {

    static Map<String, Object> toMap(JSONObject jsonObj)  throws JSONException {
        Map<String, Object> map = new HashMap<>();
        Iterator<String> keys = jsonObj.keys();
        while(keys.hasNext()) {
            String key = keys.next();
            Object value = jsonObj.get(key);
            if (value instanceof JSONArray) {
                value = toList((JSONArray) value);
            } else if (value instanceof JSONObject) {
                value = toMap((JSONObject) value);
            }
            map.put(key, value);
        }   return map;
    }

    public static List<Object> toList(JSONArray array) throws JSONException {
        List<Object> list = new ArrayList<>();
        for(int i = 0; i < array.length(); i++) {
            Object value = array.get(i);
            if (value instanceof JSONArray) {
                value = toList((JSONArray) value);
            }
            else if (value instanceof JSONObject) {
                value = toMap((JSONObject) value);
            }
            list.add(value);
        }   return list;
    }

    static JSONObject convertMapToJson(Map<String, ?> map) throws JSONException {
        JSONObject object = new JSONObject();
        for (Map.Entry<String, ?> entry : map.entrySet()) {
            Object value = entry.getValue();
            if (value == null) {
                object.put(entry.getKey(), JSONObject.NULL);
            } else if (value instanceof Map) {
                object.put(entry.getKey(), convertMapToJson((Map<String, Object>) entry.getValue()));
            } else if (entry.getValue() instanceof Object[]) {
                object.put(entry.getKey(), convertArrayToJson((Object[]) entry.getValue()));
            } else if (entry.getValue() instanceof List) {
                object.put(entry.getKey(), convertArrayToJson(((List) entry.getValue()).toArray()));
            } else {
                object.put(entry.getKey(), entry.getValue());
            }
        }
        return object;
    }

    static JSONArray convertArrayToJson(Object[] array) throws JSONException {
        JSONArray result = new JSONArray();

        for (Object item : array) {
            if (item == null) {
                result.put(JSONObject.NULL);
            } else if (item instanceof Map) {
                result.put(convertMapToJson((Map<String, Object>) item));
            } else if (item instanceof Object[]) {
                result.put(convertArrayToJson((Object[]) item));
            } else if (item instanceof List) {
                result.put(convertArrayToJson(((List) item).toArray()));
            } else {
                result.put(item);
            }
        }

        return result;
    }

    static List<String> convertArrayToStringList(JSONArray array) throws JSONException {
        final List<String> list = new ArrayList<>();
        for (int i = 0; i < array.length(); ++i) {
            list.add(array.getString(i));
        }
        return list;
    }
}
