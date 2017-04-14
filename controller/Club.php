<?php

class Club
{

    private $id;

    private $name;

    private $fav_num;

    private $club_pic;

    public function __construct($id, $club_name, $fav_num,$club_pic)
    {
        $this->setId($id);
        $this->setName($club_name);
        $this->setFav_num($fav_num);
        $this->setClub_pic($club_pic);
    }

    /**
     *
     * @return the $id
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     *
     * @param field_type $id
     */
    public function setId($id)
    {
        $this->id = $id;
    }

    /**
     *
     * @return the $name
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     *
     * @return the $fav_num
     */
    public function getFav_num()
    {
        return $this->fav_num;
    }

    /**
     *
     * @param field_type $name
     */
    public function setName($name)
    {
        $this->name = $name;
    }

    /**
     *
     * @param field_type $fav_num
     */
    public function setFav_num($fav_num)
    {
        $this->fav_num = $fav_num;
    }

    public function getClub_pic()
    {
        return $this->club_pic;
    }

   public function setClub_pic($club_pic)
    {
        $this->club_pic = $club_pic;
    }
}