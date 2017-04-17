[**findrap.xyz**](//findrap.xyz) helps you discover dope hip-hop music based on decades, sub-genres or similar artists. Only artists that had at least one great album are included in the database.

If you think an artist is missing or the database is incomplete you can contribute or [open an issue](https://github.com/poeti8/findrap.xyz/issues).

# API
You can get FindRap dope albums and songs by requesting data via below URLs. 

### All Artists
```
http://findrap.xyz/api/artist/all
```

### Specific Artist
```ARTIST_NAME``` can be anything from all artists lists (above).

Queries: ```similar=true``` to get similar artists and  ```limit=10``` to limit response to a certain number of data.
```
http://findrap.xyz/api/artist/ARTIST_NAME
```

### All Tags
```
http://findrap.xyz/api/tag/all
```

### Specific Tag
```TAG_NAME``` can be anything from all tags lists (above).

Queries: ```random=true``` to get random tags and  ```limit=10``` to limit response to a certain number of data.
```
http://findrap.xyz/api/tag/TAG_NAME
```

# Contribute
Open [artists.json](https://github.com/poeti8/findrap.xyz/blob/master/artists.json) and add the new data. The whole data is an array of artists which each one has:

```artist```  artist's name

```songs```   an array of objects for each dope song.

```albums```  an array of objects for each dope album.

```tags```    an array of tags. only among existing tags in the API.

```related``` an array of similar artists. only among existing artists in the API.


Note that the count of dope songs should be one more than dope albums count at maximum. Also the count of all of them together shouldn't be higher than 9. 

#### How to know if an artist or an album is dope?
Based on if it is both critically and fan acclaimed.
