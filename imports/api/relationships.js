// You can create a separate table for follower/ followed relationships. So, when x follow y, create an entry with follower_id = x.id followed_id = y.id.
// 
// You can query the relationship table to look for all the users x has relations with by select * from relationships where follower_id = x.id or vice versa.
//
// When/if x un-follow y, you just have to delete the entry you originally created.
